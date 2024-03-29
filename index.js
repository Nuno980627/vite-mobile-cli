#!/usr/bin/env node

import {program} from "commander"//commonder.js解析用户的参数
import download from "download-git-repo"//从github 下载包
import inquirer from "inquirer"// inquirerjs 命令行交互包
import ora from "ora"// 加载spinner样式
import chalk from "chalk" //增加命令行输出的颜色
import path from 'path'
import {fsExist} from './util.js'
import { promisify } from 'util'
import fs from 'fs'
const promptList = [{
  type: 'list',
  message: 'select a code template:',
  name: 'templateUrl',
  choices: [
      "vite vue3",
      "vite react18"
  ],
  filter: function (val) { // 使用filter将回答变为小写
    let url=''
    switch (val) {
      case  "vite vue3":
        url ='https://github.com/Nuno980627/vite-demo-vant.git#main'
        break;
      case  "vite react18":
        url ='https://github.com/Nuno980627/antd-react-mobile.git#main'
        break;
      default:
        break;
    }
    return url
  }
}];
// set version
program.version("1.1.0");

program
  .command("create <name>") //<>必填参数 []选填参数
  .description("创建一个 vue react 项目模板")
  .action(async(name) => {
    const targetPath=path.resolve(process.cwd(),name)
    console.log(chalk.bold.rgb(147, 212, 117)('[vmobile] target path:'+targetPath))
    console.log(chalk.rgb(147, 212, 117).bold('[vmobile] project name:'+name))
    const isExist=await fsExist(targetPath)
    if(isExist){
      console.log(chalk.red('[vmobile] 该文件已存在，尝试更改项目名称'));
      process.exit(1);
    }
    inquirer.prompt(promptList).then(answers => {
      const {templateUrl}=answers
      const spinner=ora({
      text:'正在生成...',
      color:'blue'
    }).start()
    download(
      `direct:${templateUrl}`,
      name,
      { clone: true },
      function (err) {
        if(err){      
          spinner.fail('[vmobile] download fail')
          console.log(chalk.red('[vmobile]'+err));
          process.exit(1);
        }
        const filePath=path.join(targetPath,'./package.json')
        const data = fs.readFileSync(filePath)
        let packagesJSON=data.toString()
        packagesJSON= packagesJSON.replace(/code-template/g, name.trim())
        fs.writeFileSync(filePath,packagesJSON)
        spinner.succeed('[vmobile] generate template complete')
        process.exit(0);
      }
    );
    })

  });
program.parse(process.argv);
