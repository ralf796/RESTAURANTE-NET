using Geminis.Models;
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
                                  B.NUMERO AS MESA,
                                  D.USUARIO,
                                  C.NOMBRE EMPLEADO,
                                  E.ID_TIPO_PEDIDO,
                                  E.nombre AS TIPO_PEDIDO,
                                  A.TOTAL,
                                    FORMAT(A.FECHA_CREACION,'dd/MM/yyyy hh:mm tt') AS FECHA_CREACION
                                FROM PEDIDO A
                                INNER JOIN MESA B ON A.ID_MESA = B.ID_MESA
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