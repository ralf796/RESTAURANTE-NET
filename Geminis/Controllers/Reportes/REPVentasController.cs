﻿using Geminis.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Reportes
{
    public class REPVentasController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();

        // GET: REPVentas
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GenerarReporte(int anio, int mes)
        {
            try
            {
                string query = @"SELECT Format(A.fecha_creacion, 'dd/MM/yyyy') FECHA,
                                       A.id_tipo_pedido ID_TIPO_PEDIDO,
                                       B.nombre TIPO_PEDIDO,
                                       Sum(A.total) TOTAL
                                FROM   pedido A
                                       INNER JOIN tipo_pedido B
                                               ON A.id_tipo_pedido = B.id_tipo_pedido
                                WHERE  Year(a.fecha_creacion) * 100 + Month(a.fecha_creacion) = 2022 * 100 + 5
                                GROUP  BY Format(A.fecha_creacion, 'dd/MM/yyyy'),
                                          A.id_tipo_pedido,
                                          B.nombre  ";
                var lista = db.Database.SqlQuery<REPORTE>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public class REPORTE
        {
            public string FECHA { set; get; }
            public int? ID_TIPO_PEDIDO{ set; get; }
            public string TIPO_PEDIDO{ set; get; }
            public string TOTAL{ set; get; }
        }

    }
}