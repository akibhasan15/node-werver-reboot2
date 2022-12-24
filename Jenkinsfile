node {   
    stage('Clone repository') {
        git credentialsId: 'c9e7b7e5-b7f5-4851-afb7-dd8fca25aa7b', url: 'https://github.com/akibhasan15/Node-Simple-web'
    }
    
    stage('Build image') {
       dockerImage = docker.build("akib123/node-simple-web:latest")
    }
    
 stage('Push image') {
        withDockerRegistry([ credentialsId: "dockerhub", url: "" ]) {
        dockerImage.push()
        }
    }    
}