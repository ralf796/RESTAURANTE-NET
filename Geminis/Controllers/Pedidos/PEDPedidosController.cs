using Geminis.Clases;
using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using CrystalDecisions.CrystalReports.Engine;
using System.IO;

namespace Geminis.Controllers.Pedidos
{
    public class PEDPedidosController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: PEDPedidos
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTipoPedidos()
        {
            try
            {
                string queryTipoPedido = "SELECT ID_TIPO_PEDIDO, NOMBRE FROM TIPO_PEDIDO WHERE ID_TIPO_PEDIDO IN(2,3) AND ESTADO='A'";
                var listaTipoPedido = db.Database.SqlQuery<TIPO_PEDIDO_>(queryTipoPedido).ToList();

                string queryRepartidor = @"SELECT a.ID_EMPLEADO, a.NOMBRE FROM EMPLEADO A
                                INNER JOIN TIPO_EMPLEADO B ON A.ID_TIPO_EMPLEADO=B.ID_TIPO_EMPLEADO
                                WHERE B.NOMBRE='REPARTIDOR' and A.ESTADO='A'";
                var listaRepartidor = db.Database.SqlQuery<REPARTIDOR>(queryRepartidor).ToList();

                return Json(new { ESTADO = 1, DATA = listaTipoPedido, REPARTIDOR = listaRepartidor }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDirecciones(string cliente)
        {
            try
            {
                string query = "SELECT DIRECCION FROM CLIENTE_DATOS_ADICIONALES WHERE ID_CLIENTE=" + cliente;
                var lista = db.Database.SqlQuery<CLIENTE_DIRECCIONES>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDatosCliente(string telefono, string nit)
        {
            try
            {
                string condicion = "";
                if (telefono != "")
                    condicion = " TELEFONO = '" + telefono + "'";
                if (nit != "")
                    condicion = " NIT = '" + nit + "'";

                string query = @"SELECT ID_CLIENTE, TELEFONO,NIT,NOMBRE_CLIENTE as nombre,DIRECCION FROM CLIENTE 
                                WHERE " + condicion;
                var DatosCliente = db.Database.SqlQuery<DATOS_CLIENTE>(query).FirstOrDefault();
                return Json(new { ESTADO = 1, DATA = DatosCliente }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTipoMenu()
        {
            try
            {
                string query = "SELECT ID_TIPO_MENU, NOMBRE FROM TIPO_MENU WHERE ESTADO='A'";
                var lista = db.Database.SqlQuery<TIPO_MENU_>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetMenu(string idTipoMenu)
        {
            try
            {
                string query = @"SELECT ID_MENU, NOMBRE,PRECIO 
                                FROM MENU
                                WHERE ESTADO = 'A' AND ID_TIPO_MENU = " + idTipoMenu;
                var lista = db.Database.SqlQuery<MENU_>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetFormaPago()
        {
            try
            {
                string query = @"SELECT ID_PEDIDO_FORMA_PAGO, NOMBRE FROM PEDIDO_FORMA_PAGO WHERE ESTADO='A'";
                var lista = db.Database.SqlQuery<FORMA_PAGO_>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [SessionExpireFilter]
        public JsonResult GuardarPedido(string encabezadoPedido, string detallePedido)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<PEDIDO>(encabezadoPedido);
                    string usuario = Session["usuario"].ToString();

                    int siguientePedido = db.Database.SqlQuery<int>("SELECT ISNULL(MAX(id_pedido) + 1,1) FROM PEDIDO").FirstOrDefault();
                    int idEmpleado = db.Database.SqlQuery<int>("SELECT ID_EMPLEADO FROM USUARIO WHERE USUARIO='" + usuario + "'").FirstOrDefault();

                    obtenerDatos.ID_PEDIDO = siguientePedido;
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.ID_ESTADO_PEDIDO = 2;
                    obtenerDatos.FECHA_CREACION = Utils.ObtenerFechaServidor();
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    obtenerDatos.ID_EMPLEADO = idEmpleado;
                    //obtenerDatos.ID_TIPO_PEDIDO= obtenerDatos.ID_TIPO_PEDIDO;
                    //obtenerDatos.NOMBRE= obtenerDatos.NOMBRE;
                    //obtenerDatos.NIT= obtenerDatos.NIT;
                    //obtenerDatos.DIRECCION= obtenerDatos.DIRECCION;
                    //obtenerDatos.REPARTIDOR= obtenerDatos.REPARTIDOR;
                    //obtenerDatos.NOMBRE_RECIBE= obtenerDatos.NOMBRE_RECIBE;
                    db.PEDIDO.Add(obtenerDatos);
                    db.SaveChanges();

                    List<PEDIDO_DETALLE> listaDetalles = JsonConvert.DeserializeObject<List<PEDIDO_DETALLE>>(detallePedido);
                    foreach (var TRAER_DATO in listaDetalles)
                    {
                        PEDIDO_DETALLE GUARDAR_DETALLE = new PEDIDO_DETALLE
                        {
                            ID_PEDIDO = siguientePedido,
                            ID_MENU = TRAER_DATO.ID_MENU,
                            CANTIDAD = TRAER_DATO.CANTIDAD,
                            OBSERVACIONES = TRAER_DATO.OBSERVACIONES,
                            PRECIO = TRAER_DATO.PRECIO,
                            FECHA_CREACION = Utils.ObtenerFechaServidor(),
                            ESTADO = "A",
                            CREADO_POR = usuario,
                            SUBTOTAL = Convert.ToDecimal(TRAER_DATO.SUBTOTAL)
                        };
                        db.PEDIDO_DETALLE.Add(GUARDAR_DETALLE);
                        db.SaveChanges();
                    }
                    transaccion.Commit();
                    return Json(new { Estado = 1, PEDIDO = siguientePedido }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, MENSAJE = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }


        [SessionExpireFilter]
        public JsonResult GuardarDireccion(int idcliente, string direccion)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    int idSiguiente = db.Database.SqlQuery<int>("SELECT ISNULL(MAX(ID_CLIENTE_DATO_ADICIONAL),0)+1 FROM CLIENTE_DATOS_ADICIONALES").FirstOrDefault();
                    var entidad = new CLIENTE_DATOS_ADICIONALES
                    {
                        ID_CLIENTE_DATO_ADICIONAL = idSiguiente,
                        ID_CLIENTE = idcliente,
                        DIRECCION = direccion
                    };
                    db.CLIENTE_DATOS_ADICIONALES.Add(entidad);
                    db.SaveChanges();

                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, MENSAJE = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [SessionExpireFilter]
        public JsonResult GuardarCliente(string nombre, string nit, string telefono, string direccion)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    int idSiguiente = db.Database.SqlQuery<int>("SELECT ISNULL(MAX(ID_CLIENTE),0)+1 FROM CLIENTE").FirstOrDefault();
                    var entidad = new CLIENTE
                    {
                        ID_CLIENTE = idSiguiente,
                        NOMBRE_CLIENTE = nombre,
                        NIT = nit,
                        TELEFONO = telefono,
                        DIRECCION = direccion
                    };
                    db.CLIENTE.Add(entidad);
                    db.SaveChanges();

                    transaccion.Commit();
                    return Json(new { Estado = 1, IDCLIENTE = idSiguiente }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, MENSAJE = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }


        private List<ImpresionTicketCajaPortatil> BuscaDatosReporte(int pedido)
        {
            string query = @"SELECT a.ID_PEDIDO, CONVERT(varchar, a.fecha_creacion, 23) as fecha_creacion, d.NOMBRE AS REPARTIDOR, a.NOMBRE_RECIBE, a.TELEFONO, a.DIRECCION
                    , b.CANTIDAD, e.NOMBRE as MENU, b.SUBTOTAL, a.TOTAL from PEDIDO A
                    INNER JOIN PEDIDO_DETALLE B ON A.ID_PEDIDO=B.ID_PEDIDO
                    INNER JOIN ESTADO_PEDIDO C ON C.ID_ESTADO_PEDIDO=A.ID_ESTADO_PEDIDO
                    left join EMPLEADO d on d.ID_EMPLEADO=a.REPARTIDOR
                    inner join MENU e on e.ID_MENU=b.ID_MENU
                    where a.ID_PEDIDO=" + pedido;
            var lista = db.Database.SqlQuery<PEDIDO_REP>(query).ToList();

            List<ImpresionTicketCajaPortatil> listImpresion = new List<ImpresionTicketCajaPortatil>();
            for (int i = 0; i < lista.Count; i++)
            {
                ImpresionTicketCajaPortatil impresion = new ImpresionTicketCajaPortatil
                {
                    Planta = lista[i].NOMBRE_RECIBE,
                    Vale = lista[i].ID_PEDIDO,
                    Piloto = lista[i].REPARTIDOR,
                    Monto = lista[i].TOTAL,
                    PuntoVenta = lista[i].DIRECCION,
                    TotalRemision = lista[i].TOTAL.ToString(),
                    Cantidad = lista[i].CANTIDAD,
                    Presentacion = lista[i].SUBTOTAL,
                    UnidadMedida = lista[i].MENU,
                    Remision = 45,
                    NOMBRE_CLIENTE = lista[i].NOMBRE_RECIBE,
                    Liquidacion = lista[i].TELEFONO
                };
                listImpresion.Add(impresion);
            }
            return listImpresion;
        }
        /*
        [SessionExpireFilter]
        public void ImprimirTicketPortatil(int cobro)
        {
            ReportDocument rd = new ReportDocument();
            rd.Load(Path.Combine(Server.MapPath("~/Tickets"), "ImpresionTicketCajaPortatil.rpt"));

            var listPedidos = BuscaDatosReporte(cobro);
            rd.SetDataSource(listPedidos);

            Response.Buffer = false;
            Response.ClearContent();
            Response.ClearHeaders();
            
            rd.ExportToHttpResponse(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat, System.Web.HttpContext.Current.Response, false, "ReportePedidos");
            rd.Close();
            rd.Dispose();
        }
        */
        
        
        
        public class DATOS_CLIENTE
        {
            public int? ID_CLIENTE { set; get; }
            public string TELEFONO { set; get; }
            public string NIT { set; get; }
            public string NOMBRE { set; get; }
            public string DIRECCION { set; get; }
        }
        public class CLIENTE_DIRECCIONES
        {
            public string DIRECCION { set; get; }
        }
        public class TIPO_PEDIDO_
        {
            public int? ID_TIPO_PEDIDO { set; get; }
            public string NOMBRE { set; get; }
        }
        public class REPARTIDOR
        {
            public int? ID_EMPLEADO { set; get; }
            public string NOMBRE { set; get; }
        }
        public class TIPO_MENU_
        {
            public int? ID_TIPO_MENU { set; get; }
            public string NOMBRE { set; get; }
        }
        public class MENU_
        {
            public int? ID_MENU { set; get; }
            public string NOMBRE { set; get; }
            public decimal PRECIO { set; get; }
        }
        public class FORMA_PAGO_
        {
            public int? ID_PEDIDO_FORMA_PAGO { set; get; }
            public string NOMBRE { set; get; }
        }
        public class ImpresionTicketCajaPortatil
        {
            public string Planta { get; set; }
            public string Folio { get; set; }
            public DateTime Fecha { get; set; }
            public int Vale { get; set; }
            public string Piloto { get; set; }
            public decimal Monto { get; set; }
            public string PuntoVenta { get; set; }
            public string Liquidacion { get; set; }
            public double Carburacion { get; set; }
            public int Cantidad { get; set; }
            public decimal Presentacion { get; set; }
            public string UnidadMedida { get; set; }
            public string TotalRemision { get; set; }
            public decimal Remision { get; set; }
            public string NOMBRE_CLIENTE { get; set; }
        }
        public class RecargaPortatil
        {
            public decimal cantidad { get; set; }
            public decimal MONTO { get; set; }
            public int PRESENTACION { get; set; }
            public string UNIDAD_MEDIDA { get; set; }
            public int PLANTA { get; set; }
            public int VALE_RECARGA { get; set; }
            public string EMPLEADO_LIQUIDA { get; set; }
            public string NOMBRE { get; set; }
            public string NOMPLANTA { get; set; }
            public long PEDIDO_ENC { get; set; }
        }
        public class PEDIDO_REP
        {
            public int ID_PEDIDO { get; set; }
            public string FECHA_CREACION { get; set; }
            public string NOMBRE_RECIBE { get; set; }
            public string REPARTIDOR { get; set; }
            public string TELEFONO { get; set; }
            public string DIRECCION { get; set; }
            public int CANTIDAD { get; set; }
            public string MENU { get; set; }
            public decimal PRECIO { get; set; }
            public decimal SUBTOTAL { get; set; }
            public decimal TOTAL { get; set; }
        }
    }
}