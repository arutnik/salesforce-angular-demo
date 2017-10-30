# Salesforce + Angular 4 #

This repo contains a demonstration of loading an Angular 4 app inside a Visualforce page, including support for static assets, Apex controller access and router deep links.

## Salesforce Org Set up ##

Inside your Salesforce org add an Apex class named sftestcontroller:


    public class sftestcontroller {
    
       @RemoteAction
       public static string helloAngular(string name) {
           return 'User ' + UserInfo.getUserId() + ' says hello ' + name;
       }
    }

In this project under /salesforce add a file called 'dev.sf'


    sf.username = YOUR user name
    sf.password = YOUR password
    sf.token = YOUR security token
    sf.url = https://login.salesforce.com


Check your org to make sure that login URL is right.

## Install and run ##


    npm install -g concurrently
    npm install
    npm run sf


This will cause your project to build and deploy to Salesforce, with any changes being automatically built and deployed. Your Angular app will be available at [YOUR_ORG_URL]/apex/sftestpage
