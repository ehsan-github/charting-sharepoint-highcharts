import { getApiF, path } from './utils'
import $ from 'jquery';

export const getItems = listId => getApiF(
    `/_api/web/lists(guid'${listId}')/items`
).chain(path(r => r.results))

// export const getSpItems = spName => postApiF(
//     '/_layouts/15/reporting/tahvil/tahvil.aspx/getspdata',
//     { spName }
// )

export const getAddressItems = address => getApiF(
    address
).chain(path(r => r.results));


export const getSpItems = spName => $.ajax({
    method: 'POST',
    headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        credentials: 'include',
        'X-Requested-With': 'XMLHttpRequest'
    },
    url: '/_layouts/15/reporting/tahvil/tahvil.aspx/getspdata',
    data: JSON.stringify({ spName })

})
    .then(x => x.d)
