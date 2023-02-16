export default function (url, data = {}, {
  method = 'POST',
  headers = {}
} = {}){
  return new Promise((rs,rj)=>{
    try{
      let body = JSON.stringify(data),
      options = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers
        },
        body
      }
      
      console.log("------REQUEST-------");
      console.log("url",url);
      console.log("body",body);
      console.log("------REQUEST END-------");
      
      
        fetch(url, options)
        .then(response=>{
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Something went wrong on API server!');
          }
        })
        .then(response=>{
          console.log("------RESPONSE-------");
          console.log("response",response);
          console.log("------RESPONSE END-------");

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