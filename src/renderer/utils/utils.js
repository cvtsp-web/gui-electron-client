import os from 'os'
import fs from 'fs'
import path from 'path'
import { Loading } from 'element-ui'
import spawn from 'cross-spawn'

export const homeDir = os.homedir();

/**
 * 本项目的路径解析
 */
export const ownAppResolve = function() {
    const args = Array.prototype.slice.call(arguments, 0);
    return path.resolve.apply(path, [process.cwd()].concat(args));
}

/**
 * 兼容window和mac路径解析问题
 */
export const formatter = function() {
    const args = Array.prototype.slice.call(arguments, 0);
    return  path.resolve.apply(path, ['../../'].concat(args));
}

export const basename = function() {
    return path.posix.basename.apply(path, arguments);
}

export const extname = function() {
    return path.extname.apply(path, arguments);
}

export const readFileSync = function(url) {
    return fs.readFileSync(formatter(url));
}

export const readdirSync = function(url) {
    return fs.readdirSync(formatter(url));
}

export const isFile = function(url) {
    const statSync = fs.statSync(formatter(url));
    return statSync.isFile();
}

export const isDirectory = function(url) {
    const statSync = fs.statSync(formatter(url));
    return statSync.isDirectory();
}
/**
 * 获取项目根目录的package.json的路径
 * @param {*} rootUrl 
 */
export const getPackagePath = function(rootUrl) {
    return formatter(rootUrl, 'package.json')
}

/**
 * 将package.json 转换json对象
 * @param {*} rootUrl 
 */
export const getPackageJSON = function(rootUrl) {
    const packageDir = getPackagePath(rootUrl);
    return JSON.parse(fs.readFileSync(packageDir).toString());
}

/**
 * 下载指定的安装包
 * @param {*} name 
 * @example: spawn.sync(name, ['-V'], {stdio: 'inherit'});
 */
export const installPackage = function(name) {
    let loadingInstance = Loading.service({ fullscreen: true });
    const cnpmResult = spawn.sync('cnpm', ['-v'], { stdio: 'inherit'})
    if(cnpmResult.error) {  // cnpm没有下载 自动下载cnpm
        //npm install -g cnpm --registry=https://registry.npm.taobao.org
        spawn.sync('npm', ['install','-g', 'cnpm', '--registry=https://registry.npm.taobao.org']);
    }

    // 1.下载指定安装包
    const installResult = spawn.sync('cnpm', ['install', name,'--save']);
    // 2. 在main.js注册库
    
    loadingInstance.close();
}

/**
 * 删除指定的安装包
 * 在node_modules删除
 * 1. 从package.json中找到该包名和版本号
 * 2. 再去node_modules 中删除对应的包文件
 * //_iview@3.1.0@iview
 * @param {*} name 
 */
export const uninstallPackage = function(name) {
    const packageJSON = getPackageJSON(process.cwd());
    const { dependencies } = packageJSON;
    if(!dependencies[name]) {
        // 安装包中不存在该包
    }else {
        const packVersion = dependencies[name].replace(/\^/g, '');
        const cachePack = `_${name}@${packVersion}@${name}`;

        process.chdir(ownAppResolve('node_modules'));
        const rm = spawn.sync('rm', ['-rf', name, cachePack]);
        delete dependencies[name];

        process.chdir(ownAppResolve('..'));
        fs.writeFileSync(ownAppResolve('package.json'), JSON.stringify(packageJSON, null, 4));
    }
}



/**
 * 从项目的package.json 检测框架名称
 * 会在package.json 的dependencies中检测【vue, angular, react】
 * @param {String} rootUrl: 项目的根路径
 * @return {angular|vue|react}
 */
export const checkFrameFromPackage = function(rootUrl) {
    try {
        const packageJSON = getPackageJSON(rootUrl);
        const dependencies = packageJSON['dependencies'];
        
        if(dependencies) {
            for(let key in dependencies) {
                if(['angular', 'vue', 'react'].indexOf(key) >= 0) return key;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * 从项目的package.json 检测框架样式框架
 * @param {*} rootUrl 
 */
export const checkPostcssFromPackage = function(rootUrl) {
    try {
        const packageJSON = getPackageJSON(rootUrl);
        const devDependencies = packageJSON['devDependencies'];
        if(devDependencies) {
            for(let key in devDependencies) {
                if(['sass-loader', 'less-loader', 'stylus-loader'].indexOf(key) >= 0) {
                    const splitLists = key.split('-');
                    return splitLists[0];
                }else {
                    return 'css'
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const isIE = function() {
    return !!window.ActiveXObject || "ActiveXObject" in window ? true : false;
  };
  
var USER_URGENT = (window.navigator && window.navigator.userAgent) || "";
var IeVersion = (function() {
var result = /MSIE\s(\d+)\.\d/.exec(USER_URGENT);
var version = result && parseFloat(result[1]);
    if (
        !version &&
        /Trident\/7.0/i.test(USER_URGENT) &&
        /rv:11.0/.test(USER_URGENT)
    ) {
        // IE 11 has a different user agent string than other IE versions
        version = 11.0;
    }
    return version;
})();

export const IE_VERSION = IeVersion;

export const insertAfter = function(newEl, targetEl) {
    let parentNode = targetEl.parentNode;
    if(parentNode.lastChild === targetEl) {
        parentNode.appendChild(newEl);
    }else {
        parentNode.insertBefore(newEl, targetEl.nextSibling);
    }
}

/**
 * 异步加载远程js脚本(对地图貌似不是很适用，后期会研究一下)
 * @param {String} name: 全局变量名(必须唯一的， 目前为了防止加载重复的cdn)
 * @param {URL} cdn: 远程cdn地址
 * @return {Promise} 返回一个promise
 */
export const asyncDownloadScript = function(name, cdn, target) {
    // global == window   window.baidu = {_preloader: null}
    if (!global[name]) {
      global[name] = {}; // window.baidu = {}
      // window.baidu._preloader = new promise
      global[name]._preloader = new Promise((resolve, reject) => {
        const $script = document.createElement("script");
        $script.src = cdn;
        if(target) {
            insertAfter($script, target);
        }else {
            global.document.body.appendChild($script); // window.document.body.appendCHild
        }
        if (isIE() && IE_VERSION < 11) {
          // ie
            $script.onreadystatechange = function() {
                if (
                $script.readyState == "loaded" ||
                $script.readyState == "complete"
                ) {
                    resolve(global[name]);
                    // wind.baidu._preloader = null 释放内存
                    global[name]._preloader = null;
                }
            };
        } else {
            // 高级浏览器  11  edge chrome fix opera
            $script.onload = function() {
                resolve(global[name]);
                // wind.baidu._preloader = null 释放内存
                global[name]._preloader = null;
            };
        }
      });
      return global[name]._preloader;
    } else if (!global[name]._preloader) {
        return Promise.resolve(global[name]);
    } else {
        return global[name]._preloader;
    }
}

