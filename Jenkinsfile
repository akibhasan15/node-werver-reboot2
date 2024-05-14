pipeline {
    agent {label 'mylabel'}
    
    
    
  environment{
      GITHUB_URL = "https://github.com/akibhasan15/Node-Simple-web"
     BACKUP= "./backup"
      TEMP= "./temp"
      APP= "./express"
  }

   stages {
   stage('Test') {
            steps {
                
                //git branch: 'master',
                //url: "${GITHUB_URL}"
             //    git branch: [
             //       [name: 'main'],
             //       [name: 'test']
            //    ],
               // credentialsId: 'your_credentials_id', 
             //   url: "${GITHUB_URL}"
                
                
                 sshagent(credentials: ['productionHost']) {
               withCredentials([string(credentialsId: 'UNIP',variable: 'userAtIP')]) {
                sh 'scp  ${userAtIP}:./configurationfile/express/* ./'
                   
               }}
                 nodejs(nodeJSInstallationName: 'node'){
                 sh "cp -f ../package.json ./"
                 sh "npm install"
                 sh "npm install pm2@latest -g" 
                 sh "pm2 start server.js"
                 //sh "node server.js"
                 //sh ' if [ curl -s -o /dev/null -w "%{http_code}" localhost:3000 == 200 ];then echo "successful";fi'
                 sh 'STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" localhost:3000); if [ "$STATUS_CODE" -eq 200 ]; then echo "Success"; else  error "Request failed with status code: ${STATUS_CODE}"; fi'
                 //sh "sleep(10)"
                  sh "pm2 stop server"
                // sh ""
                 
                 sh "cat package.json && ls -a"
                 sh "rm -rf ./node_modules"
                 sh "tar czfv ../express.tar.gz ."
                //sh "cd ./app1 && mvn -Dmaven.test.failure.ignore=true clean package"
                // To run Maven on a Windows agent, use
               // bat "mvn -Dmaven.test.failure.ignore=true clean package"
            }}

        } 

     stage('Deploy-to-Test-Environment') {
          when {
         
             expression{env.GIT_BRANCH=="origin/test"}
         }
            steps{
               sshagent(credentials: ['productionHost']) {
               withCredentials([string(credentialsId: 'UNIP',variable: 'userAtIP')]) {
                 // sh 'ssh ${userAtIP} "who"'
                
                 sh 'scp ../express.tar.gz  ${userAtIP}: '
                // sh 'ssh -o StrictHostKeyChecking=no ${userAtIP} uname -a'
                 sh 'ssh ${userAtIP} "if curl -fqI http://localhost:3000;then pm2 stop server; else echo "server stopped long ago"; fi"'
                 sh 'ssh ${userAtIP} "mkdir -p backup && if [ -f ./express/pacakage.json ]; then tar czvf ./backup/express.$(date +%F_%R).tar.gz ./express/;fi"'
                 sh 'ssh ${userAtIP} "mkdir -p temp && tar xzfv ./express.tar.gz -C ./temp/ && cp -u -r ./temp/* ./express/ "'
                 //sh "npm install pm2@latest -g" 
                 sh 'ssh ${userAtIP} "cd express && npm install && pm2 start server.js"'
                 //sh 'ssh ${userAtIP} "STATUS_CODE=$(curl -s -o /dev/null -Iw "%{http_code}" localhost:3000); if [ "$STATUS_CODE" -eq "200" ]; then echo "Success"; else  error "Request failed with status code: ${STATUS_CODE}"; fi"'
                 sh 'ssh ${userAtIP} "if [ -f ./express.tar.gz ]; then rm ./express.tar.gz;fi"'
                sh 'ssh ${userAtIP} "if curl -fqI http://localhost:3000;then echo "sucessfully deployed"; else error "deployment failed"; fi"'
               
                
}
    }
            }
    } 
    
      stage('Deploy-to-Production') {
          when {
         
             expression{env.GIT_BRANCH=="origin/main"}
         }
            steps{
               sshagent(credentials: ['productionHost']) {
               withCredentials([string(credentialsId: 'UNIP',variable: 'userAtIP')]) {
                 // sh 'ssh ${userAtIP} "who"'
                
                 sh 'scp ../express.tar.gz  ${userAtIP}: '
                // sh 'ssh -o StrictHostKeyChecking=no ${userAtIP} uname -a'
                 sh 'ssh ${userAtIP} "if curl -fqI http://localhost:3000;then pm2 stop server; else echo "server stopped long ago"; fi"'
                 sh 'ssh ${userAtIP} "mkdir -p backup && if [ -f ./express/pacakage.json ]; then tar czvf ./backup/express.$(date +%F_%R).tar.gz ./express/;fi"'
                 sh 'ssh ${userAtIP} "mkdir -p temp && tar xzfv ./express.tar.gz -C ./temp/ && cp -u -r ./temp/* ./express/ "'
                 //sh "npm install pm2@latest -g" 
                 sh 'ssh ${userAtIP} "cd express && npm install && pm2 start server.js"'
                 //sh 'ssh ${userAtIP} "STATUS_CODE=$(curl -s -o /dev/null -Iw "%{http_code}" localhost:3000); if [ "$STATUS_CODE" -eq "200" ]; then echo "Success"; else  error "Request failed with status code: ${STATUS_CODE}"; fi"'
                 sh 'ssh ${userAtIP} "if [ -f ./express.tar.gz ]; then rm ./express.tar.gz;fi"'
                sh 'ssh ${userAtIP} "if curl -fqI http://localhost:3000;then echo "sucessfully deployed"; else error "deployment failed"; fi"'
               
                
}
    }
            }
    } 
    
    
    
   }
}
