window.CRMApp = window.CRMApp || {};

window.CRMApp.components = (() => {
    const { FILTRO_OPCIONES, TAMANO_LOTE } = window.CRMApp.constants;
    const {
        requiereFechaCompromiso,
        requiereFechaPropuesta,
        getRiskUI,
        formatHistorialDate,
        formatearMoneda,
        getSummaryCards,
        getAlertCards
    } = window.CRMApp.utils;

    const HistorialCliente = ({ historial }) => {
        if (!historial || historial.length === 0) {
            return (
                <div className="bg-slate-50 rounded-2xl px-4 py-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Sin historial reciente
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-slate-50 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Historial reciente
                </p>
                <div className="space-y-3">
                    {historial.slice(0, 5).map((item, idx) => (
                        <div key={`hist-${idx}`} className="border-b border-slate-200 last:border-b-0 pb-2 last:pb-0">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{formatHistorialDate(item.fecha)}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.asesor || ''}</span>
                            </div>
                            <p className="text-xs font-extrabold text-slate-700 uppercase mt-1">{item.etapa || 'Sin etapa'}</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.comentario || 'Sin comentario'}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const ClienteCard = ({ cliente, onUpdate, idx, numeroTarjeta = null, hoja, etapasPorHoja }) => {
        const riskUI = getRiskUI(cliente.riesgo);

        return (
            <div className={`bg-white rounded-[2rem] p-6 shadow-lg border border-slate-200 ring-1 ring-slate-100 transition-all ${cliente.gestionado ? 'border-indigo-200 ring-indigo-100' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {numeroTarjeta !== null && (
                                <div className="min-w-[30px] h-[30px] rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">
                                    {numeroTarjeta}
                                </div>
                            )}
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{cliente.co_cuenta}</p>
                        </div>
                        {hoja === 'BD' ? (
                            <div className="bg-slate-50 rounded-2xl px-4 py-3 space-y-2 border border-slate-100">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Nombre del cliente
                                    </p>
                                    <h3 className="font-extrabold text-slate-900 text-sm uppercase leading-tight">
                                        {cliente.nombre || 'Sin Nombre'}
                                    </h3>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Recurrencia
                                    </p>
                                    <p className="text-xs font-black text-slate-700 uppercase tracking-wide">
                                        {cliente.recurrencia !== '' && cliente.recurrencia !== null && cliente.recurrencia !== undefined
                                            ? formatearMoneda(cliente.recurrencia)
                                            : 'Sin recurrencia'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-2xl px-4 py-3 space-y-2 border border-slate-100">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Nombre
                                    </p>
                                    <h3 className="font-extrabold text-slate-900 text-sm uppercase leading-tight">
                                        {cliente.nombre || 'Sin Nombre'}
                                    </h3>
                                </div>
                                {cliente.nombreMostrado && cliente.nombreMostrado !== cliente.nombre && (
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                            Nombre mostrado
                                        </p>
                                        <p className="text-xs font-black text-slate-700 uppercase tracking-wide">
                                            {cliente.nombreMostrado}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${cliente.gestionado ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        {cliente.gestionado ? 'Listo' : 'Pendiente'}
                    </div>
                </div>
                <div className="mb-4 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${riskUI.dot}`}></div>
                    <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${riskUI.pill}`}>{riskUI.text}</div>
                </div>
                <div className="mb-4">
                    <HistorialCliente historial={cliente.historial} />
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Nueva Etapa</label>
                            <select value={cliente.nuevaEtapa} onChange={(e) => onUpdate(idx, 'nuevaEtapa', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none">
                                {etapasPorHoja.map((etapa) => <option key={etapa} value={etapa}>{etapa}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Valor</label>
                            <input type="number" value={cliente.nuevoValor} onChange={(e) => onUpdate(idx, 'nuevoValor', e.target.value)} disabled={hoja === 'Recupero'} className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none disabled:opacity-50" />
                        </div>
                    </div>
                    {requiereFechaCompromiso(hoja, cliente) && (
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Fecha acuerdo de pago</label>
                            <input type="date" value={cliente.fechaCompromisoPago || ''} onChange={(e) => onUpdate(idx, 'fechaCompromisoPago', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-3 text-xs font-bold text-slate-600 outline-none" />
                        </div>
                    )}
                    {requiereFechaPropuesta(hoja, cliente) && (
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Fecha de propuesta</label>
                            <input type="date" value={cliente.fechaPropuesta || ''} onChange={(e) => onUpdate(idx, 'fechaPropuesta', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-3 text-xs font-bold text-slate-600 outline-none" />
                        </div>
                    )}
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Comentario</label>
                        <textarea value={cliente.nuevoComentario} onChange={(e) => onUpdate(idx, 'nuevoComentario', e.target.value)} placeholder="Escribe la gestión aquí..." className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none resize-none h-16" />
                    </div>
                </div>
            </div>
        );
    };

    const ConfigView = ({
        modo,
        setModo,
        hoja,
        setHoja,
        filtroEstado,
        setFiltroEstado,
        asesor,
        setAsesor,
        asesoresDisponibles,
        cargandoAsesores,
        iniciarLote,
        cargarResumenSupervisor,
        cargando,
        cargandoResumenSupervisor,
        nuevoRegistro,
        setNuevoRegistro,
        creandoRegistro,
        crearNuevoRegistro,
        resultadoCreacion
    }) => (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 animate-slide-up text-center">
                <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-3xl font-black">D</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tighter">CRM Lotes</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">GitHub Ready</p>
                <div className="space-y-4 text-left">
                    <div>
                        <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-4 mb-1 block">Perfil</label>
                        <div className="flex bg-slate-100 p-1 rounded-2xl">
                            <button onClick={() => setModo('ASESOR')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${modo === 'ASESOR' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>Asesor</button>
                            <button onClick={() => setModo('SUPERVISOR')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${modo === 'SUPERVISOR' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>Supervisor</button>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-4 mb-1 block">Tipo de Cartera</label>
                        <div className="flex bg-slate-100 p-1 rounded-2xl">
                            <button onClick={() => setHoja('BD')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${hoja === 'BD' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>Desarrollo</button>
                            <button onClick={() => setHoja('Recupero')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${hoja === 'Recupero' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>Recupero</button>
                        </div>
                    </div>
                    {modo === 'ASESOR' && (
                        <>
                            <div>
                                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-4 mb-1 block">Filtro de Cuentas</label>
                                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 outline-none font-bold text-slate-700 transition-all">
                                    {FILTRO_OPCIONES.map((opcion) => <option key={opcion.value} value={opcion.value}>{opcion.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-4 mb-1 block">Selecciona Asesor</label>
                                <select value={asesor} onChange={(e) => setAsesor(e.target.value)} disabled={cargandoAsesores} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 outline-none font-bold text-slate-700 transition-all disabled:opacity-60">
                                    <option value="">{cargandoAsesores ? "Cargando asesores..." : "Selecciona un asesor..."}</option>
                                    {asesoresDisponibles.map((nombre, index) => <option key={`${nombre}-${index}`} value={nombre}>{nombre}</option>)}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-2 ml-2">
                                    {hoja === 'BD' ? 'BD toma los asesores desde "Propietario de la cuenta".' : 'Recupero toma los asesores desde "Asignado a".'}
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <button onClick={modo === 'ASESOR' ? iniciarLote : cargarResumenSupervisor} disabled={modo === 'ASESOR' ? (!asesor || cargando || cargandoAsesores) : cargandoResumenSupervisor} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black py-5 rounded-2xl mt-8 shadow-xl shadow-indigo-100 transition-all uppercase text-xs tracking-widest">
                    {modo === 'ASESOR' ? (cargando ? "CARGANDO..." : "INICIAR GESTIÓN") : (cargandoResumenSupervisor ? "CARGANDO..." : "VER RESUMEN")}
                </button>

                <div className="mt-8 text-left border-t border-slate-100 pt-8">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Registro nuevo</p>
                    <p className="text-xs text-slate-400 mb-5">Valida en Historia, BD y Recupero; si no existe, se crea en BD.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Co_cuenta</label>
                            <input value={nuevoRegistro.co_cuenta} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, co_cuenta: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-3 px-4 outline-none font-bold text-slate-700 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Nombre del cliente</label>
                            <input value={nuevoRegistro.nombre} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, nombre: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-3 px-4 outline-none font-bold text-slate-700 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Recurrencia</label>
                            <input type="number" value={nuevoRegistro.recurrencia} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, recurrencia: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-3 px-4 outline-none font-bold text-slate-700 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Nuevo valor</label>
                            <input type="number" value={nuevoRegistro.nuevoValor} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, nuevoValor: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-3 px-4 outline-none font-bold text-slate-700 transition-all" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Responsable</label>
                        <input value={nuevoRegistro.responsable} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, responsable: e.target.value })} placeholder="Propietario de la cuenta / Asignado a" className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-3 px-4 outline-none font-bold text-slate-700 transition-all" />
                    </div>
                    {resultadoCreacion && (
                        <div className={`mt-4 rounded-2xl px-4 py-3 text-xs font-bold ${resultadoCreacion.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                            {resultadoCreacion.message}
                        </div>
                    )}
                    <button onClick={crearNuevoRegistro} disabled={creandoRegistro} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl mt-5 shadow-xl shadow-emerald-100 transition-all uppercase text-xs tracking-widest">
                        {creandoRegistro ? "VALIDANDO..." : "CREAR NUEVO REGISTRO"}
                    </button>
                </div>
            </div>
        </div>
    );

    const SupervisorView = ({ hoja, resumenSupervisor, volverAFiltros }) => {
        const summaryCards = getSummaryCards(resumenSupervisor);
        const alertCards = getAlertCards(resumenSupervisor);
        const asesoresResumen = resumenSupervisor?.porAsesor || [];

        return (
            <div className="max-w-5xl mx-auto p-4 pb-16 animate-slide-up">
                <header className="flex items-center justify-between mb-6 px-2">
                    <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Vista Supervisor</p>
                        <h2 className="text-2xl font-black text-slate-900">{hoja}</h2>
                        <p className="text-sm text-slate-400 mt-1">Resumen operativo y alertas por cartera</p>
                    </div>
                    <button onClick={volverAFiltros} className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 text-xs font-black uppercase tracking-widest text-slate-700">Volver</button>
                </header>
                <section className="mb-8">
                    <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 px-1">Resumen general</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {summaryCards.map((item, idx) => (
                            <div key={`sum-${idx}`} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.titulo}</p>
                                <p className="text-3xl font-black text-slate-900">{item.valor}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="mb-8">
                    <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 px-1">Alertas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {alertCards.map((item, idx) => (
                            <div key={`alert-${idx}`} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.titulo}</p>
                                <p className="text-3xl font-black text-slate-900">{item.valor}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 px-1">Avance por asesor</h3>
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Asesor</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pendientes</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">En gestión</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Compromisos / Propuestas</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recuperados / Cerrados</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vencidos</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Riesgo alto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asesoresResumen.length === 0 ? (
                                        <tr><td colSpan="7" className="px-6 py-8 text-sm text-slate-400 text-center">Sin datos disponibles</td></tr>
                                    ) : (
                                        asesoresResumen.map((item, idx) => (
                                            <tr key={`asesor-${idx}`} className="border-t border-slate-100">
                                                <td className="px-6 py-4 text-sm font-extrabold text-slate-900">{item.asesor}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.pendientes}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.enGestion}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.oportunidades}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.cerrados}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.vencidos}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.riesgoAlto}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        );
    };

    const LoteView = ({
        hoja,
        asesor,
        filtroEstado,
        clientesPendientes,
        loteVisibleBase,
        resumenEjecutivo,
        busquedaGlobal,
        setBusquedaGlobal,
        buscarGlobal,
        buscandoGlobal,
        resultadoBusquedaGlobal,
        sincronizarBusquedaGlobal,
        cargando,
        clientes,
        actualizarLocal,
        actualizarGlobal,
        etapasPorHoja,
        loteCompletoGestionado,
        finalizarLote,
        volverAFiltros
    }) => (
        <div className="max-w-5xl mx-auto p-4 pb-32 animate-slide-up">
            <header className="flex items-center justify-between mb-6 px-2">
                <div>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{hoja} - Lote de {Math.min(TAMANO_LOTE, loteVisibleBase.length)}</p>
                    <h2 className="text-xl font-black text-slate-900">{asesor}</h2>
                    <p className="text-xs text-slate-400 mt-1">Filtro actual: {filtroEstado}</p>
                    <p className="text-xs text-slate-400">Pendientes por trabajar: {clientesPendientes.length}</p>
                </div>
                <button onClick={volverAFiltros} className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 text-xs font-black uppercase tracking-widest text-slate-700">Ir a Filtros</button>
            </header>
            <section className="mb-6">
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 px-1">Mini resumen del ejecutivo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total cargadas</p><p className="text-3xl font-black text-slate-900">{resumenEjecutivo.totalCargadas}</p></div>
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pendientes</p><p className="text-3xl font-black text-slate-900">{resumenEjecutivo.pendientes}</p></div>
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{hoja === 'Recupero' ? 'Compromisos' : 'Propuestas'}</p><p className="text-3xl font-black text-slate-900">{resumenEjecutivo.oportunidades}</p></div>
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{hoja === 'Recupero' ? 'Recuperados' : 'Cerrados'}</p><p className="text-3xl font-black text-slate-900">{resumenEjecutivo.cerrados}</p></div>
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vencidos</p><p className="text-3xl font-black text-slate-900">{resumenEjecutivo.vencidos}</p></div>
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Riesgo alto</p><p className="text-3xl font-black text-slate-900">{resumenEjecutivo.riesgoAlto}</p></div>
                </div>
            </section>
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 mb-6">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">Búsqueda Global</p>
                <div className="flex gap-2">
                    <input type="text" placeholder="Buscar por nombre o co_cuenta..." value={busquedaGlobal} onChange={(e) => setBusquedaGlobal(e.target.value)} className="flex-1 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-3 px-4 outline-none font-semibold text-sm transition-all" />
                    <button onClick={buscarGlobal} disabled={buscandoGlobal} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black px-4 rounded-2xl text-[10px] uppercase tracking-widest">{buscandoGlobal ? "BUSCANDO..." : "BUSCAR"}</button>
                </div>
            </div>
            {resultadoBusquedaGlobal.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Resultado de búsqueda global</p>
                            <p className="text-xs text-slate-400">{resultadoBusquedaGlobal.length} cuenta(s) encontrada(s)</p>
                        </div>
                        <button onClick={sincronizarBusquedaGlobal} disabled={cargando} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest">{cargando ? "GUARDANDO..." : "SINCRONIZAR GLOBAL"}</button>
                    </div>
                    <div className="space-y-4">
                        {resultadoBusquedaGlobal.map((cliente, idx) => (
                            <ClienteCard key={`global-card-${cliente.co_cuenta}-${idx}`} cliente={cliente} onUpdate={actualizarGlobal} idx={idx} numeroTarjeta={idx + 1} hoja={hoja} etapasPorHoja={etapasPorHoja} />
                        ))}
                    </div>
                </div>
            )}
            {loteVisibleBase.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
                    <h3 className="text-lg font-black text-slate-900 mb-2">No hay más cuentas pendientes</h3>
                    <p className="text-sm text-slate-500">Puedes volver al menú y cargar otro filtro o módulo.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {loteVisibleBase.map((cliente, visibleIndex) => {
                        const idxGlobal = clientes.findIndex((item) => item.co_cuenta === cliente.co_cuenta && !item.sincronizado);
                        return <ClienteCard key={`lote-card-${cliente.co_cuenta}-${visibleIndex}`} cliente={cliente} onUpdate={actualizarLocal} idx={idxGlobal} numeroTarjeta={visibleIndex + 1} hoja={hoja} etapasPorHoja={etapasPorHoja} />;
                    })}
                </div>
            )}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
                <button onClick={finalizarLote} disabled={cargando || !loteCompletoGestionado} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-all border border-slate-700 disabled:bg-slate-300 disabled:border-slate-300">
                    {cargando ? "GUARDANDO..." : `SINCRONIZAR LOTE ACTUAL (${loteVisibleBase.filter((cliente) => cliente.gestionado).length}/${loteVisibleBase.length})`}
                </button>
            </div>
        </div>
    );

    return {
        ConfigView,
        SupervisorView,
        LoteView
    };
})();
