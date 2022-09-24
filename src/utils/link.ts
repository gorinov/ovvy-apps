export class LinkUtil {
    static getParam(url, name){
        return new URLSearchParams(url).get(name);
    }

    static getPath(){
        return document.location.pathname;
    }
}