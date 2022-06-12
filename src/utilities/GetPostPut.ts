/**
 *                  F E T C H        E X A M P L E S
 * 
 *      https://www.carlrippon.com/fetch-with-async-await-and-typescript/
 * 
 */

interface HttpResponse<T> extends Response {
    parsedBody?: T;
}

export async function http<T>( request: RequestInfo ): Promise<HttpResponse<T>> {
    try{
        const response: HttpResponse<T> = await fetch( request );
        response.parsedBody = await response.json();
        return response;
    }
    catch(err){console.log(err); throw "err"; }
  }

export async function get<T>(
  path: string,
  args: RequestInit = { method: "get" }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
};

export async function post<T>(
  path: string,
  body: any,
  args: RequestInit = { method: "post", body: JSON.stringify(body) }
): Promise<HttpResponse<T>>  {
  return await http<T>(new Request(path, args));
};

export async function put<T>(
  path: string,
  body: any,
  args: RequestInit = { method: "put", body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
};


/*

      // example consuming code

usage import { post, put, get } from './utilities/GetPostPut'
const response = await post<{ id: number }>(
    "https://jsonplaceholder.typicode.com/posts",
    { title: "my post", body: "some content" }
);

*/