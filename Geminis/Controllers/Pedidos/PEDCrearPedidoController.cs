using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Pedidos
{
    public class PEDCrearPedidoController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: PEDCrearPedido
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult GuardarPedido(string encabezadoPedido, string detallePedido)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<PEDIDO>(encabezadoPedido);

                    int siguientePedido = db.Database.SqlQuery<int>("SELECT ISNULL(MAX(id_pedido) + 1,1) FROM PEDIDO_ENCABEZADO").FirstOrDefault();

                    obtenerDatos.ID_PEDIDO = siguientePedido;
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = "RALOPEZ";
                    db.PEDIDO.Add(obtenerDatos);
                    db.SaveChanges();

                    List<PEDIDO_DETALLE> listaDetalles = JsonConvert.DeserializeObject<List<PEDIDO_DETALLE>>(detallePedido);

                    foreach (var TRAER_DATO in listaDetalles)
                    {
                        PEDIDO_DETALLE GUARDAR_DETALLE = new PEDIDO_DETALLE
                        {
                            ID_PEDIDO = siguientePedido,
                            ID_MENU = TRAER_DATO.ID_MENU,
                            ID_PRODUCTO = TRAER_DATO.ID_PRODUCTO,
                            CANTIDAD = TRAER_DATO.CANTIDAD,
                            OBSERVACIONES = TRAER_DATO.OBSERVACIONES,
                            FECHA_CREACION = DateTime.Now,
                            ESTADO = "A",
                            CREADO_POR = "RALOPEZ",
                            SUBTOTAL = Convert.ToDecimal(TRAER_DATO.CANTIDAD) * Convert.ToDecimal(db.PRODUCTO.Where(s => s.ID_PRODUCTO == TRAER_DATO.ID_PRODUCTO).FirstOrDefault().PRECIO)
                        };
                        db.PEDIDO_DETALLE.Add(GUARDAR_DETALLE);
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
    }
}