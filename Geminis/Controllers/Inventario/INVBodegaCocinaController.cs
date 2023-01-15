using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Geminis.Clases;
using Geminis.Models;

namespace Geminis.Controllers.Inventario
{
    public class INVBodegaCocinaController : Controller
    {
        // GET: INVBodegaCocina
        readonly Restaurante_BDEntities bd = new Restaurante_BDEntities();
        [SessionExpireFilter]
        public ActionResult Index()
        {
            return View();
        }
            //funcion cargar bodega cocina
            public JsonResult CargarTablaInventarioCocina()
        {
            try
            {
                string query = @"SELECT 
                                A.ID_INVENTARIO_COCINA, A.NOMBRE, 
                                ISNULL(A.CANTIDAD_NETA,0) AS CANTIDAD, 
                                CONVERT(VARCHAR(20), A.FECHA_INGRESO) AS FECHA_INGRESO,
                                ISNULL(A.PRECIO,0) AS PRECIO,ISNULL(A.SUBTOTAL,0) AS SUBTOTAL,
                                B.ID_UNIDAD_MEDIDA, B.DESCRIPCION AS UNIDAD_MEDIDA
                                FROM INVENTARIO_COCINA A
                                INNER JOIN UNIDAD_MEDIDA B ON
                                A.ID_UNIDAD_MEDIDA= B.ID_UNIDAD_MEDIDA";
                var lista = bd.Database.SqlQuery<TABLA_COCINA_>(query).ToList();
                return Json(new { Estado = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);

            }
        }

        public class TABLA_COCINA_
        {
            public int? ID_INVENTARIO_COCINA { get; set; }
            public string NOMBRE { get; set; }
            public decimal? CANTIDAD { get; set; }
            public string FECHA_INGRESO { get; set; }
            public decimal? PRECIO { get; set; }
            public decimal? SUBTOTAL { get; set; }
            public int? ID_UNIDAD_MEDIDA { get; set; }
            public string UNIDAD_MEDIDA { get; set; }
        }


    }
}