

import sys
import re
import argparse
import shutil
import os
import zipfile


parser = argparse.ArgumentParser()
parser.add_argument("--assets", help="")
parser.add_argument("--controller", help="")
parser.add_argument("--pagename", help="")
parser.add_argument("--builddir", help="")
args = parser.parse_args()

assetsName = args.assets
controller = args.controller
pageName = args.pagename
builddir = args.builddir

pagesRoot = 'salesforce/' + builddir + '/pages/'
staticsRoot = 'salesforce/' + builddir + '/staticresources/'
inAppPageRoot = 'apex/' + pageName

html = open('dist/index.html').read()


regexJs = re.compile(r'\"([^\"]*.\.js)\"')
regexCss = re.compile(r'\"([^\"]*.\.css)\"')
regexIco = re.compile(r'\"([^\"]*.ico)\"')

replacer = r'"{!URLFOR($Resource.' + assetsName + r', ' + r"'" + r'\1' + r"'" + r')}"'

html = regexJs.sub(replacer, html)
html = regexCss.sub(replacer, html)
html = regexIco.sub(replacer, html)

html = html.replace('<html lang="en">', '<apex:page showheader="false" sidebar="false" standardStylesheets="false" controller="' + controller + '" >' )
html = html.replace('</html>', '</apex:page>')
html = html.replace('<!doctype html>', '')
html = html.replace('#RESOURCES#', assetsName)
html = html.replace('$SFCONTROLLER', controller)
html = html.replace('$SFPAGEROOT', "'" + inAppPageRoot + "'")
html = html.replace('_EXTERN', '')

pageMetadataTemplate = '''
<?xml version="1.0" encoding="UTF-8"?>
<ApexPage xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>39.0</apiVersion>
    <availableInTouch>false</availableInTouch>
    <confirmationTokenRequired>false</confirmationTokenRequired>
    <label>#LABEL#</label>
</ApexPage>
'''.strip()

staticMetadataTemplate = '''
<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Private</cacheControl>
    <contentType>application/x-zip-compressed</contentType>
    <description>Assets</description>
</StaticResource>
'''.strip()

def deleteIfExists( path ):
  if os.path.exists(path):
    shutil.rmtree(path)

def makeDirEmpty( path ):
  deleteIfExists(path)
  os.makedirs(path)

def zipdir(path, ziph):
  # ziph is zipfile handle
  for root, dirs, files in os.walk(path):
    for file in files:
      absfn = os.path.join(root, file)
      zfn = absfn[len(path)+len(os.sep) - 1:]
      ziph.write(absfn, zfn)

makeDirEmpty(pagesRoot)
makeDirEmpty(staticsRoot)

#Make assets zip file
zipf = zipfile.ZipFile(staticsRoot + assetsName + '.resource', 'w', zipfile.ZIP_DEFLATED)
zipdir('dist/', zipf)
zipf.close()

newFile = open(pagesRoot + pageName + '.page', 'w+')
newFile.write(html)
newFile.close()

pageMetadata = pageMetadataTemplate.replace('#LABEL#', pageName)
newFile = open(pagesRoot + pageName + '.page-meta.xml', 'w+')
newFile.write(pageMetadata)
newFile.close()

newFile = open(staticsRoot + assetsName + '.resource-meta.xml', 'w+')
newFile.write(staticMetadataTemplate)
newFile.close()

print("Done salesforce prep!")