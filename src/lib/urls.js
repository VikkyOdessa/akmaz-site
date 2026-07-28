/**
 * Where the product lives.
 *
 * One place, because these two URLs were repeated across five components — fine
 * until the server moves, when it becomes five places to find and one of them gets
 * missed. Changing hosts is now a single line.
 *
 * Currently hunter.website4u.tech. A move to a subdomain of akmaz.eu would need the
 * domain's DNS hosted at Cloudflare (a tunnel can only publish hostnames for zones
 * it manages), which is a dependency the server's owner has not asked for — and the
 * product works perfectly well where it is. There is no technical reason to move
 * before someone outside the project is looking at the address.
 */
export const PRODUCT = 'https://hunter.website4u.tech'

export const SIGNUP = `${PRODUCT}/signup`
export const LOGIN = `${PRODUCT}/login`
