import { KJUR } from "jsrsasign";
import { PageServerLoad } from '@analogjs/router';
import { defineEventHandler, sendRedirect, setHeaders } from 'h3';
import { generate } from "rxjs";
import { inject } from "@angular/core";

export const getData = async(slug: string) => {
  const JWT = await generateSignature(slug, 1);
  return JWT;
}

function  generateSignature(name: string, role: number) {
      const iat = Math.round(new Date().getTime() / 1000) - 30;
      const exp = iat + 60 * 60 * 2;
      const oHeader = { alg: "HS256", typ: "JWT" };
      const sdkKey = import.meta.env['VITE_ZOOM_SDK_KEY']
      const sdkSecret =  import.meta.env['VITE_ZOOM_SDK_SECRET']
      const oPayload = {
        app_key: sdkKey, tpc: name, role_type: role, version: 1, iat: iat, exp: exp,
      };
      const sHeader = JSON.stringify(oHeader);
      const sPayload = JSON.stringify(oPayload);
      const sdkJwt = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
      return sdkJwt;
    }


