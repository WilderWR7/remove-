    function values(cadena, keys,master) {
      var patron = /^(\w+)\s+(\[.*?\])$/;
      cadena = cadena.replace('- DRAFT ','');
    var coincidencias = cadena.match(patron);

    if (!coincidencias) {
        return null;
    }

    var error = coincidencias[1];
    var paresRaw = coincidencias[2];
    var pares = paresRaw.matchAll(/\[([^:]+):\s*([^,\]]+)\]/g);
     var objetoResultado = { master: master,error: error.trim() };

    keys.forEach(key => {
        if (!(key in objetoResultado)) {
            objetoResultado[key] = "";
        }
    });
    for (const par of pares) {
        var clave = par[1].trim();
        var valor = par[2].trim();
        objetoResultado[clave] = valor;
    }
    return objetoResultado;
}

function stringToObject(cadena, keys) {
    var patron = /^(\w+)\|\[([\s\S]+?)\]$/gm;
    var matches = cadena.matchAll(patron);

    var resultados = [];

    for (const match of matches) {
        var errorPrincipal = match[1];
        var valoresRaw = match[2];
        var valores = valoresRaw.split(",").map(function (valor) {
            return values(valor.trim().slice(0, -1).slice(1), keys,errorPrincipal);
        });

        var resultado = valores.filter(Boolean);

        resultados.push(resultado);
    }

    return resultados;
}

var cadena = `mMRFBS|[
    "FEED_CUP_RESOLVING_MPN_CONFLICT [mpn: 1145512] [oldId: b7c8f987-0f3a-48f2-9484-ae083dd628e5]",
    "FEED_CUP_RESOLVING_MPN_CONFLICT [mpn: 1145511] [oldId: c04379ee-08eb-4239-a6cb-399060f25e70]",
    "FEED_CUP_RESOLVING_MPN_CONFLICT [mpn: 1145513] [oldId: 1f7f42c6-325b-4a88-82ba-c85bfcab6df2]",
]
mRDBNNA|[
    "FEED_CUP_SWATCH_NOT_AVAILABLE - DRAFT [code: G852A] [frame: 60\"]"
]
m14236|[
    "FEED_VAR_MISSING_CHILD_PRODUCT [id: b272186d-df78-416b-a5d5-893501fe28c5]",
    "FEED_VAR_MISSING_CHILD_PRODUCT [id: adb21809-ff50-4763-b5c0-627e82ad170b]",
    "FEED_VAR_MISSING_CHILD_PRODUCT [id: 22d4b6d2-e8b8-464c-b838-3a948e7a6c6c]"
]`;
//orden
const keys = [
    "mpn",
    "sku",
    "setMpn",
    "setSku",
    "color",
    "size",
    "fabric",
    "frame",
];

var resultado = stringToObject(cadena, keys);
function objectToString(object) {
    let value = "";
    Object.keys(object).forEach(function (key) {
        if (typeof object[key] === "object") {
            value += objectToString(object[key])+'\n';
        } else {
            value += `${object[key]},`;
        }
    });
    return value;
}

console.log(objectToString(resultado));