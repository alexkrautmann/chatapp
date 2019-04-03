// Most of this config is to make metro handle symlinks
// much of it the code was taken from this longstanding issue
// https://github.com/facebook/metro/issues/1

const path      = require('path');
const fs        = require('fs');
const blacklist = require('metro-config/src/defaults/blacklist');
const getDefaultValues = require('metro-config/src/defaults').getDefaultValues;

const defaultValues = getDefaultValues(__dirname);

function resolvePath(...parts) {
  var thisPath = path.resolve.apply(path, parts);
  if (!fs.existsSync(thisPath))
    return;

  return fs.realpathSync(thisPath);
}

function isExternalModule(modulePath) {
  return (modulePath.substring(0, (__dirname).length) !== __dirname);
}

function listDirectories(rootPath, cb) {
  fs.readdirSync(rootPath).forEach((fileName) => {
    if (fileName.charAt(0) === '.')
      return;

    var fullFileName = path.join(rootPath, fileName),
      stats = fs.lstatSync(fullFileName),
      symbolic = false;

    if (stats.isSymbolicLink()) {
      fullFileName = resolvePath(fullFileName);
      if (!fullFileName)
        return;

      stats = fs.lstatSync(fullFileName);

      symbolic = true;
    }

    if (!stats.isDirectory())
      return;

    var external = isExternalModule(fullFileName);
    cb({ rootPath, symbolic, external, fullFileName, fileName });
  });
}

function buildFullModuleMap(moduleRoot, mainModuleMap, externalModuleMap, _alreadyVisited, _prefix) {
  if (!moduleRoot)
    return;

  var alreadyVisited = _alreadyVisited || {},
    prefix = _prefix;

  if (alreadyVisited && alreadyVisited.hasOwnProperty(moduleRoot))
    return;

  listDirectories(moduleRoot, ({ fileName, fullFileName, symbolic, external }) => {
    if (symbolic)
      return buildFullModuleMap(resolvePath(fullFileName, 'node_modules'), mainModuleMap, externalModuleMap, alreadyVisited);

    var moduleMap = (external) ? externalModuleMap : mainModuleMap,
      moduleName = (prefix) ? path.join(prefix, fileName) : fileName;

    if (fileName.charAt(0) !== '@')
      moduleMap[moduleName] = fullFileName;
    else
      return buildFullModuleMap(fullFileName, mainModuleMap, externalModuleMap, alreadyVisited, fileName);
  });
}

function buildModuleResolutionMap(alternateRoots) {
  var moduleMap = {},
    externalModuleMap = {};

  buildFullModuleMap(baseModulePath, moduleMap, externalModuleMap);

  // add the main alternateRoot paths
  // const alternateRootsMap = alternateRoots.reduce((acc, alternateRootPath) => {
  //   // TODO: unsafe
  //   const packageName = require(`${alternateRootPath}/package.json`).name;
  //   acc[packageName] = `${alternateRootPath}/src`;
  //   return acc;
  // }, {});
  const alternateRootsMap = {};

  // Root project modules take precedence over external modules
  return Object.assign({}, alternateRootsMap, externalModuleMap, moduleMap);
}

function findAlernateRoots(moduleRoot = baseModulePath, alternateRoots = [], _alreadyVisited) {
  var alreadyVisited = _alreadyVisited || {};
  if (alreadyVisited && alreadyVisited.hasOwnProperty(moduleRoot))
    return;

  alreadyVisited[moduleRoot] = true;

  listDirectories(moduleRoot, ({ fullFileName, fileName, external }) => {
    if (fileName.charAt(0) !== '@') {
      if (external)
        alternateRoots.push(fullFileName);
    } else {
      findAlernateRoots(fullFileName, alternateRoots, alreadyVisited);
    }
  });

  return alternateRoots;
}

function getPolyfillHelper() {
  var getPolyfills;

  // Get default react-native polyfills
  try {
    getPolyfills = require('react-native/rn-get-polyfills');
  } catch(e) {
    getPolyfills = () => [];
  }

  // See if project has custom polyfills, if so, include the PATH to them
  try {
    let customPolyfills = require.resolve('./polyfills.js');
    getPolyfills = (function(originalGetPolyfills) {
      return () => originalGetPolyfills().concat(customPolyfills);
    })(getPolyfills);
  } catch(e) {}

  return getPolyfills;
}

const baseModulePath = resolvePath(__dirname, 'node_modules');
// watch alternate roots (outside of project root)
const alternateRoots = findAlernateRoots();
// build full module map for proper
// resolution of modules in external roots
const extraNodeModules = buildModuleResolutionMap(alternateRoots);

// TODO: should we just watch alternateRoots and not just their src dir
// const watchFolders = alternateRoots.map(alternateRoots =>`${alternateRoots}/src`);

const moduleBlacklist = alternateRoots.map(
  root => new RegExp(
    path.join(root, 'node_modules', 'react-native')
      .replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&') + '(\/.+)?'
  )
);

if (alternateRoots && alternateRoots.length)
  console.log('Found alternate project roots: ', alternateRoots);

// TODO: watching not working?
module.exports = {
  resolver: {
    extraNodeModules: {
      ...extraNodeModules,
      // force all packages to use the native app's instance of styled-components
      'styled-components': require.resolve('styled-components')
    },
    blacklistRE: blacklist(moduleBlacklist),
    sourceExts: [
      ...defaultValues.resolver.sourceExts,
      "css",
      "scss"
    ],
    resolverMainFields: [
      // We might want "react-native" if we care to import styled-components instead of styled-components/native
      // https://www.styled-components.com/docs/basics#simpler-usage-with-the-metro-bundler
      // 'react-native',
      // Use chatappMain since we want metro to transpile its own deps to avoid multiple watches
      'chatappMain',
      ...defaultValues.resolver.resolverMainFields,
    ]
  },
  // TODO: if we don't point these to src, only watch the module "dist" folders
  watchFolders: alternateRoots,
  serializer: {
    getPolyfills: getPolyfillHelper()
  },
  transformer: {
    babelTransformerPath: "react-native-ueno-css-modules/transformer"
  },
};
