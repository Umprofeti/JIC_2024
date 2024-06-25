import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {updateData} from './helper/updateUbi'

export async function middleware(request: NextRequest) {

    const {geo}  = request
    const {latitude, longitude} = geo
    console.log('tets')
    console.log(geo)
    await updateData(latitude.toString(), longitude.toString())
    return NextResponse.redirect(new URL('/', request.url))
}
 
export const config = {
  matcher: '/',
}