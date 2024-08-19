import { KJUR } from "jsrsasign";
import { PageServerLoad } from '@analogjs/router';
import { defineEventHandler, sendRedirect, setHeaders } from 'h3';
import { generate } from "rxjs";


// export const load = async ({
//   params, // params/queryParams from the request
//   req, // H3 Request
//   res, // H3 Response handler
//   fetch, // internal fetch for direct API calls,
//   event, // full request event
// }: PageServerLoad) => {

//   const jwt = generateSignature('test', 1);
//   console.log(jwt)
//   return jwt; 

//   function generateSignature(sessionName: string, role: number) {
//     const iat = Math.round(new Date().getTime() / 1000) - 30;
//     const exp = iat + 60 * 60 * 2;
//     const oHeader = { alg: "HS256", typ: "JWT" };
//     const sdkKey = process.env["ZOOM_SDK_KEY"];
//     const sdkSecret = process.env["ZOOM_SDK_SECRET"];
//     const oPayload = {
//       app_key: sdkKey, tpc: sessionName, role_type: role, version: 1, iat: iat, exp: exp,
//     };
//     const sHeader = JSON.stringify(oHeader);
//     const sPayload = JSON.stringify(oPayload);
//     const sdkJwt = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
//     return sdkJwt;
//   }
// };


export default defineEventHandler ((event) =>  {

  const jwt = generateSignature('test', 1);
  console.log(jwt)
  return jwt; 

  function generateSignature(sessionName: string, role: number) {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };
    const sdkKey = process.env["ZOOM_SDK_KEY"];
    const sdkSecret = process.env["ZOOM_SDK_SECRET"];
    const oPayload = {
      app_key: sdkKey, tpc: sessionName, role_type: role, version: 1, iat: iat, exp: exp,
    };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJwt = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
    return sdkJwt;
  }

})


// export default defineEventHandler((event) => {
//   return {foo: 'helloworld'}
// })