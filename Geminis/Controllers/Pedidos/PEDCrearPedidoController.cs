using Geminis.Clases;
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
        //readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: PEDCrearPedido
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Mesas()
        {
            return View();
        }
        /*
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
                    obtenerDatos.ID_ESTADO_PEDIDO = 1;
                    obtenerDatos.FECHA_CREACION = Utils.ObtenerFechaServidor();
                    //obtenerDatos.HORA_CREACION = Utils.ObtenerHoraServidor();
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    obtenerDatos.ID_EMPLEADO = idEmpleado;
                    obtenerDatos.ID_TIPO_PEDIDO = 1;
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
                            //HORA_CREACION = Utils.ObtenerHoraServidor(),
                            ESTADO = "A",
                            CREADO_POR = usuario,
                            SUBTOTAL = Convert.ToDecimal(TRAER_DATO.SUBTOTAL)
                        };
                        db.PEDIDO_DETALLE.Add(GUARDAR_DETALLE);
                        db.SaveChanges();
                    }

                    string queryMesa = @"update MESA set ESTADO='I' where ID_MESA=" + obtenerDatos.ID_MESA;
                    db.Database.ExecuteSqlCommand(queryMesa);

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
        public JsonResult EditarPedido(int pedido, string detallePedido)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string usuario = Session["usuario"].ToString();

                    List<PEDIDO_DETALLE> listaDetalles = JsonConvert.DeserializeObject<List<PEDIDO_DETALLE>>(detallePedido);
                    decimal total = 0;
                    foreach (var TRAER_DATO in listaDetalles)
                    {
                        PEDIDO_DETALLE GUARDAR_DETALLE = new PEDIDO_DETALLE
                        {
                            ID_PEDIDO = pedido,
                            ID_MENU = TRAER_DATO.ID_MENU,
                            CANTIDAD = TRAER_DATO.CANTIDAD,
                            OBSERVACIONES = TRAER_DATO.OBSERVACIONES,
                            PRECIO = TRAER_DATO.PRECIO,
                            FECHA_CREACION = DateTime.Now,
                            ESTADO = "A",
                            CREADO_POR = usuario,
                            SUBTOTAL = Convert.ToDecimal(TRAER_DATO.SUBTOTAL)
                        };
                        total = total + Convert.ToDecimal(GUARDAR_DETALLE.SUBTOTAL);
                        db.PEDIDO_DETALLE.Add(GUARDAR_DETALLE);
                        db.SaveChanges();
                    }
                    string query = @"UPDATE PEDIDO SET TOTAL = TOTAL + " + total + " WHERE ID_PEDIDO=" + pedido;
                    db.Database.ExecuteSqlCommand(query);

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
                                WHERE ESTADO = 'A' AND ID_TIPO_MENU = " + idTipoMenu;
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
                string query = @"SELECT
                                  A.ID_PEDIDO,
                                  B.NUMERO,
                                  C.DESCRIPCION,
                                  ISNULL(D.SUBTOTAL, 0) TOTAL,
                                    FORMAT(A.FECHA_CREACION,'dd/MM/yyyy hh:mm tt') AS FECHA_CREACION
                                FROM PEDIDO A
                                INNER JOIN MESA B
                                  ON A.ID_MESA = B.ID_MESA
                                INNER JOIN ESTADO_PEDIDO C
                                  ON A.ID_ESTADO_PEDIDO = C.ID_ESTADO_PEDIDO
                                LEFT JOIN (SELECT
                                  X.ID_PEDIDO,
                                  SUM(ISNULL(X.SUBTOTAL, 0)) AS SUBTOTAL
                                FROM PEDIDO_DETALLE X
                                WHERE X.ESTADO = 'A'
                                GROUP BY X.ID_PEDIDO) D
                                  ON D.ID_PEDIDO = A.ID_PEDIDO
                                WHERE A.ESTADO = 'A'
                                AND CONVERT(varchar, A.FECHA_CREACION, 23)= CONVERT(varchar, GETDATE(), 23)
                                AND a.ID_ESTADO_PEDIDO IN (1)";
                var lista = db.Database.SqlQuery<PEDIDOS>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDetallePedido(string pedido)
        {
            try
            {
                string query = @"SELECT
                                  B.ID_DETALLE_PEDIDO,
                                  C.NOMBRE MENU,
                                  B.OBSERVACIONES,
                                  CONVERT(DECIMAL(16,2), ISNULL(B.CANTIDAD, 0)) CANTIDAD,
                                  CONVERT(DECIMAL(16,2), ISNULL(B.PRECIO, 0)) PRECIO,
                                  CONVERT(DECIMAL(16,2), ISNULL(B.SUBTOTAL, 0)) SUBTOTAL  
                                FROM PEDIDO A
                                INNER JOIN PEDIDO_DETALLE B
                                  ON A.ID_PEDIDO = B.ID_PEDIDO
                                INNER JOIN MENU C
                                  ON C.ID_MENU = B.ID_MENU
                                WHERE A.ID_PEDIDO = " + pedido + @"
                                    AND b.ESTADO='A'";
                var lista = db.Database.SqlQuery<DETALLE_PEDIDOS>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult QuitarDetalle(string idDetallePedido)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = @"UPDATE PEDIDO_DETALLE SET ESTADO='I' WHERE ID_DETALLE_PEDIDO=" + idDetallePedido;
                    db.Database.ExecuteSqlCommand(query);
                    db.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }
        public JsonResult CancelarPedido(string pedido)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = @"UPDATE PEDIDO SET ID_ESTADO_PEDIDO = 3 WHERE ID_PEDIDO=" + pedido;
                    db.Database.ExecuteSqlCommand(query);

                    string ObtenerMesa = "select ID_MESA from PEDIDO WHERE ID_PEDIDO=" + pedido;
                    int mesa = db.Database.SqlQuery<int>(ObtenerMesa).FirstOrDefault();

                    string queryMesa = @"update MESA set ESTADO='A' where ID_MESA=" + mesa;
                    db.Database.ExecuteSqlCommand(queryMesa);

                    string queryDet = @"UPDATE PEDIDO_DETALLE SET ESTADO = 'I' WHERE ID_PEDIDO=" + pedido;
                    db.Database.ExecuteSqlCommand(queryDet);
                    db.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }
        public JsonResult EntregarPedido(string pedido)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string ObtenerMesa = "select ID_MESA from PEDIDO WHERE ID_PEDIDO=" + pedido;
                    int mesa = db.Database.SqlQuery<int>(ObtenerMesa).FirstOrDefault();

                    string queryMesa = @"update MESA set ESTADO='A' where ID_MESA=" + mesa;
                    db.Database.ExecuteSqlCommand(queryMesa);

                    string query = @"UPDATE PEDIDO SET ID_ESTADO_PEDIDO = 2 WHERE ID_PEDIDO=" + pedido;
                    db.Database.ExecuteSqlCommand(query);

                    string queryMenu = "select  B.ID_MENU, SUM(B.CANTIDAD)AS CANTIDAD_PEDIDO, C.ID_INVENTARIO_COCINA, C.CANTIDAD AS CANTIDAD_MENU from PEDIDO A inner join PEDIDO_DETALLE B ON A.ID_PEDIDO = B.ID_PEDIDO INNER JOIN MENU_DETALLE C ON C.ID_MENU = B.ID_MENU WHERE A.ID_PEDIDO ="+pedido+@" AND B.ESTADO = 'A' GROUP BY B.ID_MENU, C.ID_INVENTARIO_COCINA, C.CANTIDAD";
                    var obtenerPedido = db.Database.SqlQuery<DESCUENTO>(queryMenu).ToList();
                    int idCocina=0;
                    decimal cantidad_pedido = 0;
                    decimal cantidad_menu = 0;
                    decimal diferencia = 0;
                    foreach (var item in obtenerPedido)
                    {
                        idCocina = item.ID_INVENTARIO_COCINA;
                        cantidad_pedido = item.CANTIDAD_PEDIDO;
                        cantidad_menu = item.CANTIDAD_MENU;
                        diferencia = cantidad_pedido * cantidad_menu;
                        string queryCocina = "update INVENTARIO_COCINA SET CANTIDAD_NETA =CANTIDAD_NETA-"+diferencia+" WHERE ID_INVENTARIO_COCINA="+idCocina;
                        db.Database.ExecuteSqlCommand(queryCocina);
                        string querySubtotal = "UPDATE INVENTARIO_COCINA SET SUBTOTAL = CANTIDAD_NETA * PRECIO WHERE ID_INVENTARIO_COCINA ="+idCocina;
                        db.Database.ExecuteSqlCommand(querySubtotal);
                    }

                   
             
                   //for(int i = 0; i < obtenerPedido.Count;i++)
                   // {
                   //     for(int j=2; j < 4; j++)
                   //     {
                   //         cantidad = obtenerPedido[i][j];
                   //     }
                   // }

                    db.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        public JsonResult ContMesas()
        {
            try
            {
                string query = @"select COUNT(*) from MESA where ESTADO='A'";
                int contador = db.Database.SqlQuery<int>(query).FirstOrDefault();
                return Json(new { ESTADO = 1, CONTADOR = contador }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        */
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
            public string DESCRIPCION { set; get; }
            public decimal TOTAL { set; get; }
            public string FECHA_CREACION { set; get; }
        }
        public class DETALLE_PEDIDOS
        {
            public int ID_DETALLE_PEDIDO { set; get; }
            public string MENU { set; get; }
            public string OBSERVACIONES { set; get; }
            public decimal CANTIDAD { set; get; }
            public decimal PRECIO { set; get; }
            public decimal SUBTOTAL { set; get; }
        }
        public class DESCUENTO
        {
            public int ID_MENU { get; set; }
            public int CANTIDAD_PEDIDO { get; set; }
            public int ID_INVENTARIO_COCINA { get; set; }
            public decimal CANTIDAD_MENU { get; set; }
        }
    }
}