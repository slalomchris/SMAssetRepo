/**
 * TO-DO: Add support for links inside tab content
 * 
 */
 import BaseChatMessage from 'lightningsnapin/baseChatMessage';
  // import { NavigationMixin } from 'lightning/navigation';
 import { track, wire } from 'lwc';
 // import { loadStyle } from 'lightning/platformResourceLoader';
 // import cssResource from '@salesforce/resourceUrl/chatMessageOverrideCss';
 
 const DEFAULT_MESSAGE_PREFIX = 'PLAIN_TEXT';
 const RICHTEXT_MESSAGE_PREFIX = 'RICH_TEXT';
 const LONGTEXT_MESSAGE_PREFIX = 'LONG_TEXT';
 const YOUTUBE_MESSAGE_PREFIX = 'YOUTUBE';
 const IMAGE_MESSAGE_PREFIX = 'IMAGE';
 const URL_MESSAGE_PREFIX = 'URL';
 const KNOWLEDGE_TABS = 'KNOWLEDGE_TAB';
 const CAROUSEL_MESSAGE_PREFIX = 'CAROUSEL';
 const MAP_MESSAGE_PREFIX = 'MAP';
 const TRANSCRIPTID_MESSAGE_PREFIX = 'TRANSCRIPT';
 const SITE_MESSAGE_PREFIX = '{"[SIGNIN-STATUS]":';
 const LANG_MESSAGE_PREFIX = '{"[CHANGE-LANGUAGE]":';
 const SUPPORTED_MESSAGE_PREFIX = [DEFAULT_MESSAGE_PREFIX, RICHTEXT_MESSAGE_PREFIX, LONGTEXT_MESSAGE_PREFIX, YOUTUBE_MESSAGE_PREFIX, IMAGE_MESSAGE_PREFIX, URL_MESSAGE_PREFIX,KNOWLEDGE_TABS, CAROUSEL_MESSAGE_PREFIX, MAP_MESSAGE_PREFIX, TRANSCRIPTID_MESSAGE_PREFIX];
 
 export default class ChatMessageDefaultUI extends BaseChatMessage {
    @track
     mapMarkers = [];
 
     handleMarkerSelect(event) {
         this.selectedMarkerValue = event.detail.selectedMarkerValue;
     }
 
     messageType = DEFAULT_MESSAGE_PREFIX;
 
     // TRACKED
     content = '';
     @track ogpMeta = {};
     tab1Label;
     tab1Content;
     tab2Label;
     tab2Content;
     tab3Label;
     tab3Content;
     isSingleTabContent;
     longTextContent;
     hasRendered = false;
 
     connectedCallback() {
         // if (!this.isAgent) {
         //     this.testForSSN(this.messageContent.value);
         //     return;
         // }
         const messageTypePrefixPosition = SUPPORTED_MESSAGE_PREFIX.indexOf(this.messageContent.value.split('~')[0]);
         if (messageTypePrefixPosition > -1) {
             this.messageType = SUPPORTED_MESSAGE_PREFIX[messageTypePrefixPosition];
 
         }
        //console.log('msg: ' + this.messageContent.value);
         const contentValue = (this.messageContent.value.split(this.messageType + '~').length === 1) ? this.messageContent.value : this.messageContent.value.split(this.messageType + '~')[1];
        // console.log('contentvalue: ' + contentValue);
         if (this.isPlainText) {
             this.content = contentValue;
         } else if (this.isYoutube) {
             this.content = 'https://www.youtube.com/embed/' + contentValue 
         } else if (this.isImage) {
             window.clearTimeout(this.delayTimeout);
             this.content = this.extractOriginalString(contentValue);
             /*this.delayTimeout = setTimeout(() => {
                 this.content = '';
             }, 4000);*/
         } else if (this.isRichText) {
             let extract = this.removeEmailTags(contentValue);
             this.content = this.formatHtml(extract);
         } else if(this.isKnowledge){
             this.buildTabContent(contentValue.replace(/&quot;/g, '"'));
             this.content = contentValue;
         } else if (this.isUrl) {
             var linkWithLabel = this.extractOriginalString(contentValue);
             console.log("afterExtractLink " + linkWithLabel);
             this.content = linkWithLabel;
         } else if (this.isCarousel) {
             // Parse Apex response and replace character entities
             this.content = JSON.parse(contentValue.replace(/&quot;/g, '"')
                                                   .replace(/&#x27;/g, '\'')
                                                   .replace(/(<([^>]+)>)/ig, ""));
         } else if (this.isMap) {
             //console.log(JSON.stringify(contentValue));
             var unescapedContentValue = contentValue.replaceAll('&quot;','"');//unescape(contentValue);
             //unescapedContentValue = contentValue.replaceAll('.','');
             //console.log(unescapedContentValue);
             //var mapObjParsed = JSON.parse(contentValue[0]);
             //var jsonToString = JSON.stringify(unescapedContentValue);
             var jsonStringToObj = JSON.parse(unescapedContentValue);
             console.log(jsonStringToObj);
             //console.log("List length: " + unescapedContentValue.length);
             var i;
             var markerObj = {};
             for (i = 0; i < jsonStringToObj.length; i++) {
                 //console.log("Obj in loop:" + jsonStringToObj[i]);
                 markerObj = {
                     value: jsonStringToObj[i].name,
                     location: {
                         Latitude: jsonStringToObj[i].lat,
                         Longitude: jsonStringToObj[i].lon
                     },
                     title: jsonStringToObj[i].name,
                     description: jsonStringToObj[i].formatted_phone_number
                 }
                 console.log(markerObj);
                 this.mapMarkers.push(markerObj);
             }
             
                 /*{
                     value: 'France1',
                     location: {
                         City: "Cap-d'Ail",
                         Country: 'France',
                     },
         
                     icon: 'custom:custom26',
                     title: "Cap-d'Ail",
                 }*/
         }
         else {
             // Replace character entities with special characters
             // Replace <ol> tags with <ul> tags for indent spacing
             // Replace <li> tags with a hyphen and line break 
             
             this.content = this.formatHtml(contentValue);
         }
         // loadStyle(this, cssResource);
 
     }
 
 getQueryParameters(){
     var params = {};
     var search = location.search.substring(1);
     if (search) {
         params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
             return key === "" ? value : decodeURIComponent(value)
         });
     }
 
     return params;
 }
 
     testForSSN(messageContent) {
         var regexpSSN1 = new RegExp(/(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}/);
         var regexpSSN2 = new RegExp(/[0-9]{9}/);
         var needsMask = false;
 
         if(regexpSSN1.test(messageContent)){
             needsMask = true;
             var maskedContent = messageContent.replace(regexpSSN1, '###-##-####');
             this.content = maskedContent;
         }if(regexpSSN2.test(messageContent)){
             needsMask = true;
             var maskedContent = messageContent.replace(regexpSSN2, '#########');
             this.content = maskedContent;
         }else if(!needsMask){
             this.content = messageContent;
        }
     }
 
     removeEmailTags(generatedString) {
         const matched = generatedString.match(/<a href.+>(.*?)<\/a>/g);
         // console.log('match[0]: ' + matched[0]);
         // console.log('match[1]: ' + matched[1]);
         // console.log('match[2]: ' + matched[2]);
 
         if (matched.length > 1) {
             console.log('******matched length > 1');
             var trimmedString = matched[1].replace(/(<([^>]+)>)/gi, '');
             var newGeneratedString = generatedString.replace(matched[1], trimmedString);
             generatedString = newGeneratedString;
         }
         return generatedString;
     }
 
     formatHtml(message) {
         return message.replace(/&amp;quot;/g, '"')
                         .replace(/&amp;#39;/g, '\'')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/<ol>/g, '<ul>')
                         .replace(/<\/ol>/g, '</ul>')
                         .replace(/<li>/g, ' - ')
                         .replace(/<\/li>/g, '<br/>')
                         .replace(/<a href='/g, '')
                         .replace(/&quot;/g, '\"')
                         .replace(/' target='_blank'.*?<\/a>( +)/g, '$1')
                         .replace(/' target='_blank'.*?<\/a>.*?<\/a>/g, '');
     }
 
     extractOriginalString(generatedString) {
         const matched = generatedString.match(/<a href.+>(.*?)<\/a>/);
         var matchedLabel = '';
         if(generatedString.includes(":|")){
             matchedLabel = generatedString.substring(
                 generatedString.lastIndexOf(":|") + 2, 
                 generatedString.lastIndexOf("|:")
             );
         }
         if (matched.length > 1) {
             if(matchedLabel !== ''){
                 var fullLinkWithLabel = '<a href=\'' + matched[1] +'\' target="_blank">' + matchedLabel + '</a>';
                 return fullLinkWithLabel;
             }
             return matched[1];
         }
         return generatedString;
     }
 
     buildTabContent(content) {
         let tabObj = JSON.parse(content);
         var hasTab1 = tabObj.hasOwnProperty("tab1Label");
         var hasTab2 = tabObj.hasOwnProperty("tab2Label");
         var hasTab3 = tabObj.hasOwnProperty("tab3Label");
         
         if(hasTab1 && (!hasTab2 && !hasTab3)){
             this.isSingleTabContent = true;
         }
 
         if(hasTab1){
             this.tab1Label = tabObj.tab1Label;
             if(!tabObj.tab1Content){
                 this.isKnowledge = false;
                 return;
             }else{
                 this.tab1Content = tabObj.tab1Content;
             }
         }
         if(hasTab2){
             this.tab2Label = tabObj.tab2Label;
             this.tab2Content = tabObj.tab2Content;
         }
         if(hasTab3){
             this.tab3Label = tabObj.tab3Label;
             this.tab3Content = tabObj.tab3Content;
         }   
     }
 
     fallback(event) {
         event.target.onerror = null;
         event.target.style.display = 'none';
         event.target.style.height = 0;
     }
 
     get isAgent() {
         return this.userType === 'agent';
     }
 
     get isPlainText() {
         return this.messageType === DEFAULT_MESSAGE_PREFIX;
     }
 
     get isRichText() {
         return this.messageType === RICHTEXT_MESSAGE_PREFIX;
     }
 
     get isLongText() {
         return this.messageType === LONGTEXT_MESSAGE_PREFIX;
     }
 
     get isYoutube() {
         return this.messageType === YOUTUBE_MESSAGE_PREFIX;
     }
 
     get isImage() {
         return this.messageType === IMAGE_MESSAGE_PREFIX;
     }
 
     get isUrl() {
         return this.messageType === URL_MESSAGE_PREFIX;
     }
 
     get isSiteMessage() {
         return this.messageContent.value.replace(/&quot;/g, '"').startsWith(SITE_MESSAGE_PREFIX)
                || this.messageContent.value.replace(/&quot;/g, '"').startsWith(LANG_MESSAGE_PREFIX);
     }
 
     get hasOGPInfo() {
         return this.ogpMeta.title !== undefined;
     }
 
     get isKnowledge() {
         return this.messageType === KNOWLEDGE_TABS;
     }
 
     get isCarousel() {
         return this.messageType === CAROUSEL_MESSAGE_PREFIX;
     }
 
     get isMap() {
         return this.messageType === MAP_MESSAGE_PREFIX;
     }
 
     openTab(event) {
         var x = event.target;
         //var theContentForTabs = this.template.querySelectorAll('.btn-content');
         //console.log('Tab content: ' + theContentForTabs);
         var theTabs = this.template.querySelectorAll('.buttonTab').forEach(element => {
             if(element.value !== x.value){
                 element.classList.add("inactive-tab");
                 element.classList.remove("selected-tab");
             }else{
                 element.classList.add("selected-tab");
                 element.classList.remove("inactive-tab");
             }
         });
         var theTabsContent = this.template.querySelectorAll('.btn-content').forEach(element => {
             if(element.title !== x.value){
                 element.style.display = 'none';
             }else{
                 element.style.display = 'block';
             }
         });
         //document.getElementById(cityName).style.display = "block"; 
     }
 
     createNewMessage(event) {
         var content = event.target.value;
     }
 
     navigateToProduct(event) {
         var url = event.target.value;
         console.log(event.target);
         console.log(url);
         window.open(url, "_blank");
         // this[NavigationMixin.GenerateUrl]({
         //     type: 'standard__webPage',
         //     attributes: {
         //         url: this.url
         //     }
         // }).then(url => {
         //     window.open(url);
         // });;
     }
 }