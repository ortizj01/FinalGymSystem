
// Función para obtener los datos desde la API
async function fetchDataFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/compras');
        if (!response.ok) {
            throw new Error('Error al obtener los datos desde la API');
        }
        const data = await response.json();
        return data; // Retorna los datos obtenidos desde la API
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Función para procesar y agrupar los datos por fechas
function processDataForChart(data) {
    const groupedData = {};

    // Recorrer los datos y agrupar por fechas
    data.forEach(compra => {
        const fechaCompra = compra.Fecha_RegistroCompra; 
        const valorCompra = compra.ValorCompra;

        // Si la fecha no existe en el grupo, inicializarla
        if (!groupedData[fechaCompra]) {
            groupedData[fechaCompra] = 0;
        }

        // Sumar el valor de la compra a la fecha correspondiente
        groupedData[fechaCompra] += valorCompra;
    });

    // Convertir el objeto agrupado a un array de objetos para ApexCharts
    const chartData = Object.keys(groupedData).map(fecha => ({
        x: fecha,
        y: groupedData[fecha]
    }));

    // Ordenar el array por fecha (opcional)
    chartData.sort((a, b) => new Date(a.x) - new Date(b.x));

    return chartData;
}





// Función principal para configurar y renderizar el gráfico
async function renderChart() {
    // Obtener los datos desde la API
    const data = await fetchDataFromAPI();

    // Si no se pudieron obtener los datos, salir
    if (!data) {
        return;
    }

    // Procesar los datos para el gráfico
    const chartData = processDataForChart(data);

    // Configuración del gráfico con los datos procesados
    var options = {
        series: [{
            name: 'Valor de la Compra',
            data: chartData
        }],
        chart: {
            type: 'line', // Puedes usar 'line' o 'bar' según tu preferencia
            height: 350
        },
        xaxis: {
            type: 'datetime', // Tipo de eje X es fecha
            categories: chartData.map(item => item.x),
            labels: {
                format: 'yyyy-MM-dd' // Formato de las etiquetas de fecha
            }
        },
        yaxis: {
            title: {
                text: 'Valor de la Compra ($)'
            }
        },
        tooltip: {
            x: {
                format: 'yyyy-MM-dd', // Formato del tooltip de fecha
            },
            y: {
                formatter: function (val) {
                    return "$ " + val.toFixed(2); // Formato del tooltip de valor
                }
            }
        }
    };

    // Renderizar el gráfico
    var chart = new ApexCharts(document.querySelector("#charts"), options);
    chart.render();
}





// Llamar a la función principal para renderizar el gráfico
renderChart();







// Función para procesar y agrupar los datos por proveedor
function processDataForChart2(data) {
    const groupedData = {};

    // Recorrer los datos y contar las compras por proveedor
    data.forEach(compra => {
        const proveedor = compra.NombreProveedor;

        // Si el proveedor no existe en el grupo, inicializarlo
        if (!groupedData[proveedor]) {
            groupedData[proveedor] = 0;
        }

        // Contar la compra para el proveedor correspondiente
        groupedData[proveedor]++;
    });

    // Convertir el objeto agrupado a un array de objetos para ApexCharts
    const chartData = Object.keys(groupedData).map(proveedor => ({
        x: proveedor,
        y: groupedData[proveedor]
    }));

    // Ordenar el array por número de compras (opcional)
    chartData.sort((a, b) => b.y - a.y);

    return chartData;
}

// Función principal para configurar y renderizar el gráfico en charts2
async function renderChartForProveedor() {
    // Obtener los datos desde la API
    const data = await fetchDataFromAPI();

    // Si no se pudieron obtener los datos, salir
    if (!data) {
        return;
    }

    // Procesar los datos para el gráfico
    const chartData = processDataForChart2(data);

    // Configuración del gráfico con los datos procesados
    var options = {
        series: [{
            name: 'Número de Compras',
            data: chartData
        }],
        chart: {
            type: 'bar', // Gráfico de barras para contar las compras por proveedor
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'category',
            categories: chartData.map(item => item.x),
            labels: {
                formatter: function (val) {
                    return val;
                }
            }
        },
        yaxis: {
            title: {
                text: 'Número de Compras por proveedor'
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " compras";
                }
            }
        }
    };

    // Renderizar el gráfico en el elemento con id charts2
    var chart = new ApexCharts(document.querySelector("#charts2"), options);
    chart.render();
}

// Llamar a la función principal para renderizar el gráfico en charts2
renderChartForProveedor();





























async function fetchDataFromAPI3() {
    try {
        const response = await fetch('http://localhost:3000/api/devolucioncompras');
        if (!response.ok) {
            throw new Error('Error al obtener los datos desde la API');
        }
        const data = await response.json();
        return data; // Retorna los datos obtenidos desde la API
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Función para procesar y agrupar los datos por fechas
function processDataForChart3(data) {
    const groupedData = {};

    // Recorrer los datos y agrupar por fechas
    data.forEach(compra => {
        const fechaCompra = compra.Fecha_compraf; 
        const valorCompra = compra.ValorDevolucion;

        // Si la fecha no existe en el grupo, inicializarla
        if (!groupedData[fechaCompra]) {
            groupedData[fechaCompra] = 0;
        }

        // Sumar el valor de la compra a la fecha correspondiente
        groupedData[fechaCompra] += valorCompra;
    });

    // Convertir el objeto agrupado a un array de objetos para ApexCharts
    const chartData = Object.keys(groupedData).map(fecha => ({
        x: fecha,
        y: groupedData[fecha]
    }));

    // Ordenar el array por fecha (opcional)
    chartData.sort((a, b) => new Date(a.x) - new Date(b.x));

    return chartData;
}





// Función principal para configurar y renderizar el gráfico
async function renderChart3() {
    // Obtener los datos desde la API
    const data = await fetchDataFromAPI3();

    // Si no se pudieron obtener los datos, salir
    if (!data) {
        return;
    }

    // Procesar los datos para el gráfico
    const chartData = processDataForChart3(data);

    // Configuración del gráfico con los datos procesados
    var options = {
        series: [{
            name: 'Valor de la devolucion Compra',
            data: chartData
        }],
        chart: {
            type: 'area', // Puedes usar 'line' o 'bar' según tu preferencia
            height: 350
        },
        xaxis: {
            type: 'datetime', // Tipo de eje X es fecha
            categories: chartData.map(item => item.x),
            labels: {
                format: 'yyyy-MM-dd' // Formato de las etiquetas de fecha
            }
        },
        yaxis: {
            title: {
                text: 'Valor de la devolucion Compra ($)'
            }
        },
        tooltip: {
            x: {
                format: 'yyyy-MM-dd', // Formato del tooltip de fecha
            },
            y: {
                formatter: function (val) {
                    return "$ " + val.toFixed(2); // Formato del tooltip de valor
                }
            }
        }
    };

    // Renderizar el gráfico
    var chart = new ApexCharts(document.querySelector("#charts3"), options);
    chart.render();
}





// Llamar a la función principal para renderizar el gráfico
renderChart3();





// Función para procesar y agrupar los datos por fechas para devoluciones
function processDataForChart4(data) {
    const groupedData = {};

    // Recorrer los datos y contar las devoluciones por fecha
    data.forEach(devolucion => {
        const fechaDevolucion = devolucion.Fecha_compraf; // Suponiendo que Fecha_compraf es la fecha de devolución en formato 'YYYY-MM-DD'

        // Si la fecha no existe en el grupo, inicializarla
        if (!groupedData[fechaDevolucion]) {
            groupedData[fechaDevolucion] = 0;
        }

        // Incrementar el contador de devoluciones para la fecha correspondiente
        groupedData[fechaDevolucion]++;
    });

    // Convertir el objeto agrupado a un array de objetos para ApexCharts
    const chartData = Object.keys(groupedData).map(fecha => ({
        x: fecha,
        y: groupedData[fecha]
    }));

    // Ordenar el array por fecha (opcional)
    chartData.sort((a, b) => new Date(a.x) - new Date(b.x));

    return chartData;
}

// Función principal para configurar y renderizar el gráfico de devoluciones por fecha
async function renderChartForDevoluciones() {
    // Obtener los datos desde la API devolucioncompras
    const data = await fetchDataFromAPI3();

    // Si no se pudieron obtener los datos, salir
    if (!data) {
        return;
    }

    // Procesar los datos para el gráfico de devoluciones por fecha
    const chartData = processDataForChart4(data);

    // Configuración del gráfico con los datos procesados
    var options = {
        series: [{
            name: 'Cantidad de Devoluciones',
            data: chartData
        }],
        chart: {
            type: 'bar', // Puedes usar 'line' o 'bar' según tu preferencia
            height: 350
        },
        xaxis: {
            type: 'datetime', // Tipo de eje X es fecha
            categories: chartData.map(item => item.x),
            labels: {
                format: 'yyyy-MM-dd' // Formato de las etiquetas de fecha
            }
        },
        yaxis: {
            title: {
                text: 'Cantidad de Devoluciones'
            }
        },
        tooltip: {
            x: {
                format: 'yyyy-MM-dd', // Formato del tooltip de fecha
            },
            y: {
                formatter: function (val) {
                    return val + " devoluciones";
                }
            }
        }
    };

    // Renderizar el gráfico en el elemento con id charts4
    var chart = new ApexCharts(document.querySelector("#charts4"), options);
    chart.render();
}

// Llamar a la función principal para renderizar el gráfico de devoluciones por fecha
renderChartForDevoluciones();

