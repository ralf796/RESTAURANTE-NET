using Geminis.Clases;
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
                    int idEmpleado = db.Database.SqlQuery<int>("SELECT ID_EMPLEADO FROM USUARIO WHERE USUARIO='"+ usuario + "'").FirstOrDefault();

                    obtenerDatos.ID_PEDIDO = siguientePedido;
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.ID_ESTADO_PEDIDO = 1;
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    obtenerDatos.ID_EMPLEADO=idEmpleado;
                    db.PEDIDO.Add(obtenerDatos);
                    db.SaveChanges();

                    List<PEDIDO_DETALLE> listaDetalles = JsonConvert.DeserializeObject<List<PEDIDO_DETALLE>>(detallePedido);

                    foreach (var TRAER_DATO in listaDetalles)
                    {
                        PEDIDO_DETALLE GUARDAR_DETALLE = new PEDIDO_DETALLE
                        {
                            ID_PEDIDO = siguientePedido,
                            ID_MENU = TRAER_DATO.ID_MENU,
                            //ID_PRODUCTO = TRAER_DATO.ID_PRODUCTO,
                            CANTIDAD = TRAER_DATO.CANTIDAD,
                            OBSERVACIONES = TRAER_DATO.OBSERVACIONES,
                            PRECIO = TRAER_DATO.PRECIO,
                            FECHA_CREACION = DateTime.Now,
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

        public JsonResult GetMesasDisponibles()
        {
            try
            {
                string query = "SELECT ID_MESA, NUMERO FROM MESA WHERE ESTADO='A'";
                var lista = db.Database.SqlQuery<MESAS>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
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
                var lista = db.Database.SqlQuery<TIPO_MENU>(query).ToList();
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
                                WHERE ESTADO = 'A' AND ID_TIPO_MENU = "+ idTipoMenu;
                var lista = db.Database.SqlQuery<MENU>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPedidos()
        {
            try
            {
                string query = @"SELECT A.ID_PEDIDO, B.NUMERO, C.DESCRIPCION, ISNULL(A.TOTAL,0) TOTAL FROM PEDIDO A
                                INNER JOIN MESA B ON A.ID_MESA=B.ID_MESA
                                INNER JOIN ESTADO_PEDIDO C ON A.ID_ESTADO_PEDIDO=C.ID_ESTADO_PEDIDO
                                WHERE A.ESTADO='A' AND A.FECHA_CREACION = CONVERT(varchar,GETDATE(),23)";
                var lista = db.Database.SqlQuery<PEDIDOS>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public class MESAS
        {
            public int? ID_MESA { set; get; }
            public int? NUMERO { set; get; }
        }
        public class TIPO_MENU
        {
            public int? ID_TIPO_MENU { set; get; }
            public string NOMBRE { set; get; }
        }
        public class MENU
        {
            public int? ID_MENU { set; get; }
            public string NOMBRE { set; get; }
            public decimal PRECIO { set; get; }
        }
        public class PEDIDOS
        {
            public int? ID_PEDIDO { set; get; }
            public int? NUMERO { set; get; }
            public string DESCRIPCION{ set; get; }
            public decimal TOTAL{ set; get; }
        }
    }
}