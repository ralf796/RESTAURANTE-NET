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
    public class CAJCorteController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: CAJCorte
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
                                WHERE A.ID_ESTADO_PEDIDO = 4
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
        public JsonResult GuardarCorte()
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    int idCorte = db.Database.SqlQuery<int>("SELECT ISNULL(MAX(ID_CORTE),1)+1 FROM CORTE").FirstOrDefault();
                    decimal totalCorte = db.Database.SqlQuery<decimal>("SELECT isnull(sum(TOTAL),0) FROM PEDIDO where ID_ESTADO_PEDIDO=4").FirstOrDefault();
                    var entidad = new CORTE
                    {
                        ID_CORTE = idCorte,
                        TOTAL = totalCorte,
                        FECHA_CREACION = Utils.ObtenerFechaServidor(),
                        CREADO_POR = Session["usuario"].ToString()
                    };

                    db.CORTE.Add(entidad);
                    db.SaveChanges();

                    string queryListCobros = @"select b.ID_PEDIDO, ID_COBRO from COBRO a
                                        inner join PEDIDO b on a.ID_PEDIDO=b.ID_PEDIDO
                                        where b.ID_ESTADO_PEDIDO=4
                                        group by b.ID_PEDIDO, ID_COBRO";

                    var listaDetalles = db.Database.SqlQuery<PEDIDOS>(queryListCobros).ToList();
                    foreach (var TRAER_DATO in listaDetalles)
                    {
                        db.Database.ExecuteSqlCommand("UPDATE COBRO SET ID_CORTE=" + idCorte + " WHERE ID_COBRO=" + TRAER_DATO.ID_COBRO);
                        db.Database.ExecuteSqlCommand("UPDATE PEDIDO SET ID_ESTADO_PEDIDO=5 WHERE ID_PEDIDO=" + TRAER_DATO.ID_PEDIDO);
                    }

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
            public int? ID_COBRO { set; get; }
        }
    }
}