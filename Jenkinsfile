pipeline {
    agent {label 'master'}
    
    
    
  environment{
      //PATH-NAME   
      BACKUP= "./backup"
      TEMP= "./temp"
      APP= "./express"
      PORT=4000  //testing port on agent
      //APP-DETAILS
      APP_NAME="express"
  }

   stages {
   stage('Test') {
            steps {
                
                 sshagent(credentials: ['productionHost']) {
               withCredentials([string(credentialsId: 'UNIP',variable: 'userAtIP')]) {
                sh 'scp  ${userAtIP}:./configurationfile/${APP_NAME}/* ./'
                   
               }}
                 nodejs(nodeJSInstallationName: 'node'){
                 sh "cp -f ../package.json ./"
                 sh "npm install"
                 sh "npm install pm2@latest -g" 
                 sh "pm2 start server.js"
                 sh 'STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" localhost:3000); if [ "$STATUS_CODE" -eq 200 ]; then echo "Success"; else  error "Request failed with status code: ${STATUS_CODE}"; fi'
                  sh "pm2 stop server"
                 sh "rm -rf ./node_modules"
                 sh "tar czfv ../${APP_NAME}.tar.gz ."
            }}

        } 

     stage('Deploy-to-Test-Environment') {
          when {
         
             expression{env.GIT_BRANCH=="origin/test"}
         }
            steps{
               sshagent(credentials: ['productionHost']) {
               withCredentials([string(credentialsId: 'UNIP',variable: 'userAtIP')]) {
                 sh 'scp ../{APP_NAME}.tar.gz  ${userAtIP}: '
                // sh 'ssh -o StrictHostKeyChecking=no ${userAtIP} uname -a'
                 sh 'ssh ${userAtIP} "if curl -fqI http://localhost:${PORT};then pm2 stop server; else echo "server stopped long ago"; fi"'
                 sh 'ssh ${userAtIP} "mkdir -p ${BACKUP} && if [ -f  ./${APP_NAME}/pacakage.json ]; then tar czvf ${BACKUP}/${APP_NAME}.$(date +%F_%R).tar.gz ${APP}/;fi"'
                 sh 'ssh ${userAtIP} "mkdir -p ${TEMP} && tar xzfv ./${APP_NAME}.tar.gz -C ${TEMP}/ && cp -u -r ${TEMP}/* ${APP}/ "'
                 //sh "npm install pm2@latest -g" 
                 sh 'ssh ${userAtIP} "cd ${APP} && npm install && pm2 start server.js"'
                 sh 'ssh ${userAtIP} "if [ -f ./${APP_NAME}.tar.gz ]; then rm ./${APP_NAME}.tar.gz;fi"'
                sh 'ssh ${userAtIP} "if curl -fqI http://localhost:${PORT};then echo "sucessfully deployed on TEST environment"; else error "deployment failed on TEST environment"; fi"'
               
                
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
                 sh 'scp ../{APP_NAME}.tar.gz  ${userAtIP}: '
                // sh 'ssh -o StrictHostKeyChecking=no ${userAtIP} uname -a'
                 sh 'ssh ${userAtIP} "if curl -fqI http://localhost:${PORT};then pm2 stop server; else echo "server stopped long ago"; fi"'
                 sh 'ssh ${userAtIP} "mkdir -p ${BACKUP} && if [ -f  ./${APP_NAME}/pacakage.json ]; then tar czvf ${BACKUP}/${APP_NAME}.$(date +%F_%R).tar.gz ${APP}/;fi"'
                 sh 'ssh ${userAtIP} "mkdir -p ${TEMP} && tar xzfv ./${APP_NAME}.tar.gz -C ${TEMP}/ && cp -u -r ${TEMP}/* ${APP}/ "'
                 //sh "npm install pm2@latest -g" 
                 sh 'ssh ${userAtIP} "cd ${APP} && npm install && pm2 start server.js"'
                 sh 'ssh ${userAtIP} "if [ -f ./${APP_NAME}.tar.gz ]; then rm ./${APP_NAME}.tar.gz;fi"'
                sh 'ssh ${userAtIP} "if curl -fqI http://localhost:${PORT};then echo "sucessfully deployed on PRODUCTION environment"; else error "deployment failed on PRODUCTION environment"; fi"'
               
                
}
    }
            }
    } 
    
    
    
   }
}
