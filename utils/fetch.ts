export default function (url, body = {}, {
  method = 'POST',
  headers = {}
} = {}){
  return new Promise((rs,rj)=>{
    try{
      body = JSON.stringify(body);
      let options = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers
        },
        body
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
          if(response.code == 0){
            rs(response.data);
          }
        });
      
    }catch(e){
      rj(e);
      console.log(e)
    }
  })
}