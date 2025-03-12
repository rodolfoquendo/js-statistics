import {
    empty,
    isset,
    is_null,
} from "../node_modules/@rodolfoquendo/js-core/lib/Helpers.js";

export default class Statistics{
    #needles = []
    static updating = false;
    setNeedles(needles){
        this.#needles = needles;
        return this;
    }
    buildData(){
        if(!this.enabled()){
            return false;
        }
        let data = {};
        this.#needles.forEach(needle => {
            if(empty(data[needle.statistic_name])){
                data[needle.statistic_name] = 0;
            }
            if(isset(needle.element_id) 
                && !is_null(needle.element_id) 
                && !is_null(document.getElementById(needle.element_id)) 
            ){
                data[needle.statistic_name] = 1;
            }
            if(isset(needle.element_class) 
                && !is_null(needle.element_class) 
                && !is_null(document.querySelector(needle.element_class))      
            ){
                data[needle.statistic_name] = 1;
            }
            if(isset(needle.element_data) 
                && !is_null(needle.element_data)
                && !is_null(document.querySelector(`[data-${needle.element_data}]`))           
            ){
                data[needle.statistic_name] = 1;
            }
            if(isset(needle.url_full) 
                && !is_null(needle.url_full)
                && window.location.href.substring(0, needle.url_full.length) == needle.url_full    
            ){
                data[needle.statistic_name] = 1;
            }
            if(isset(needle.url_needle) 
                && !is_null(needle.url_needle) 
                && window.location.href.includes(needle.url_needle)   
            ){
                data[needle.statistic_name] = 1;
            }
        });
        return data;
    }
    url(){
        return document.querySelector('body').getAttribute('data-stats_update_url');
    }
    enabled(){
        return !is_null(this.url()) &&  this.#needles.length > 0;
    }
    async update(){
        if(!this.enabled() || Statistics.updating){
            return false;
        }
        Statistics.updating = true;
        let response = await fetch(this.url(), {
            method: 'POST',
            mode: 'cors', 
            body: JSON.stringify(this.buildData())
        });
        Statistics.updating = false;
        return response;
    }
    start(){
        if(!this.enabled()){
            return false;
        }
        if(empty(window.intervals)){
            window.intervals = {};
        }
        window.intervals['statistics.start'] = setInterval(function(){
            /* istanbul ignore next line */
            stats.update();
        },60000);
        return isset(window.intervals['statistics.start']);
    }
    static init(needles = []){
        const stats = new Statistics();
        stats.setNeedles(needles);
        if(!stats.enabled()){
            return false;
        }
        stats.start();
        return stats;
    }
};