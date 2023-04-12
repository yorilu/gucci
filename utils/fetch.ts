export default function (url, body = null, {
  method = 'POST',
  headers = {}
} = {}){
  return new Promise((rs,rj)=>{
    try{
      
      let options = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers
        }
      }

      if(body){
        options.body = JSON.stringify(body);
      }

      const showLog = false;
      if(showLog){
        console.log("------REQUEST-------");
        console.log("url",url);
        console.log("headers",headers);
        console.log("body",body);
        console.log("------REQUEST END-------");
      }
      
      fetch(url, options)
      .then(response=>{
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Something went wrong on API server!');
        }
      })
      .then(response=>{
        if(showLog){
          console.log("------RESPONSE-------");
          console.log("response",response);
          console.log("------RESPONSE END-------");
        }

        if(method == "GET"){
          rs(response);
        }else{
          if(response.code == 0){
            rs(response.data);
          }
        }
        
      });
      
    }catch(e){
      rj(e);
      console.log(e)
    }
  })
}