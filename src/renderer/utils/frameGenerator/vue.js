import spawn from 'cross-spawn'
import readline from 'readline'
import { Loading } from 'element-ui'

const CLI_DEFAULTS = {
    'vue': 'vue'    // 目前基于vue-cli@3
}

/**
 * 检查框架的脚手架版本
 * @param {String} cliName: 脚手架全局名称
 * @return {Promise}
 */
const checkFrameworkVersion = function(cliName) {
    const rline = readline.createInterface(process.stdin, process.stdout)
    return new Promise(resolve => {
        spawn.sync(cliName, ['-V'], {stdio: 'inherit'});
        rline.on('line', data => {
            resolve(data);
            rline.close();
        });
    })
}

/**
 * 创建默认预设配置
 * @param {path} dir: 创建项目的根目录
 * @param {String} projectName: 项目名称
 * @return {Promise}
 */
const createDefaultPreset = async (dir, projectName) => {
    const cliName = CLI_DEFAULTS['vue'];
    //const version = await checkFrameworkVersion(cliName);

    return new Promise(resolve => {
        // 大于3说明vue-cli@3存在
        if(true) {
            //变更Node.js进程的当前工作目录，如果变更目录失败会抛出异常(例如，如果指定的目录不存在)
            process.chdir(dir);
            
            let loadingInstance = Loading.service({ fullscreen: true, text: '正在下载vue-cli,稍安勿躁' });
            // 为了延迟，不然loading不显示
            setTimeout(() => {
                createProject();
                resolve();
            }, 100);

            function createProject() {
                // vue create <projectName> -d
                spawn.sync(cliName, ['create', projectName, '-d']);
                loadingInstance.close();
            }
        }
    })
}

export default {
    // 创建默认项目
    createDefaultPreset
}

