const Util = {
    cardSize: (size) =>{
        
    },
    allowNumeric: (val)=>{
        val = val.replace(/[^0-9\.]/g,'');
        if(val.split('.').length>2) val =val.replace(/\.+$/,"");
        return val;
    }
};

export default Util;