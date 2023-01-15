using Geminis.Clases;
using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Caja
{
    public class CAJCobroController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: CAJCobro
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetPedidos()
        {
            try
            {
                string query = @"SELECT
                                  A.ID_PEDIDO,
                                  ISNULL(B.NUMERO,0) AS MESA,
                                  D.USUARIO,
                                  C.NOMBRE EMPLEADO,
                                  E.ID_TIPO_PEDIDO,
                                  E.nombre AS TIPO_PEDIDO,
                                  A.TOTAL,
                                    FORMAT(A.FECHA_CREACION,'dd/MM/yyyy hh:mm tt') AS FECHA_CREACION
                                FROM PEDIDO A
                                LEFT JOIN MESA B ON A.ID_MESA = B.ID_MESA
                                INNER JOIN EMPLEADO C ON C.ID_EMPLEADO = A.ID_EMPLEADO
                                INNER JOIN USUARIO D ON D.ID_EMPLEADO = C.ID_EMPLEADO
                                LEFT JOIN TIPO_PEDIDO E ON E.ID_TIPO_PEDIDO = A.ID_TIPO_PEDIDO
                                WHERE A.ID_ESTADO_PEDIDO = 2
                                ORDER BY A.ID_PEDIDO DESC";
                var lista = db.Database.SqlQuery<PEDIDOS>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [SessionExpireFilter]
        public JsonResult GuardarCobro(string encabezado, string detalle)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<COBRO>(encabezado);
                    string usuario = Session["usuario"].ToString();

                    int idCobro = db.Database.SqlQuery<int>("SELECT ISNULL(MAX(ID_COBRO),0)+1 FROM COBRO").FirstOrDefault();
                    obtenerDatos.ID_COBRO = idCobro;
                    obtenerDatos.FECHA_CREACION = Utils.ObtenerFechaServidor();
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    db.COBRO.Add(obtenerDatos);
                    db.SaveChanges();

                    List<COBRO_DETALLE> listaDetalles = JsonConvert.DeserializeObject<List<COBRO_DETALLE>>(detalle);

                    foreach (var TRAER_DATO in listaDetalles)
                    {
                        COBRO_DETALLE GUARDAR_DETALLE = new COBRO_DETALLE
                        {
                            ID_COBRO = idCobro,
                            ID_PEDIDO_FORMA_PAGO = TRAER_DATO.ID_PEDIDO_FORMA_PAGO,
                            MONTO = TRAER_DATO.MONTO,
                            DOCUMENTO = TRAER_DATO.DOCUMENTO
                        };
                        db.COBRO_DETALLE.Add(GUARDAR_DETALLE);
                        db.SaveChanges();
                    }


                    string actualizarEstado = @"UPDATE PEDIDO SET ID_ESTADO_PEDIDO=4 WHERE ID_PEDIDO=" + obtenerDatos.ID_PEDIDO;
                    db.Database.ExecuteSqlCommand(actualizarEstado);

                    transaccion.Commit();
                    return Json(new { Estado = 1, COBRO = idCobro }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, MENSAJE = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        public class PEDIDOS
        {
            public int? ID_PEDIDO { set; get; }
            public int? MESA { set; get; }
            public string USUARIO { set; get; }
            public string EMPLEADO { set; get; }
            public int? ID_TIPO_PEDIDO { set; get; }
            public string TIPO_PEDIDO { set; get; }
            public decimal? TOTAL { set; get; }
            public string FECHA_CREACION { set; get; }
            public string HORA_CREACION { set; get; }
        }
    }
}