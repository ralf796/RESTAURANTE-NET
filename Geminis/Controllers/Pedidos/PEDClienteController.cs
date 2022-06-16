using Geminis.Clases;
using Geminis.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Pedidos
{
    public class PEDClienteController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();

        // GET: PEDCliente
        public ActionResult Index()
        {
            return View();
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
                        DIRECCION = direccion,
                        ESTADO = "A",
                        FECHA_CREACION = DateTime.Now,
                        CREADO_POR = Session["usuario"].ToString()
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

        public JsonResult EditarCliente(int id, string nombre, string nit, string telefono, string direccion)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = "SELECT * FROM CLIENTE WHERE ID_CLIENTE = " + id;
                    var editarTabla = db.Database.SqlQuery<CLIENTE>(query).SingleOrDefault();
                    editarTabla.NOMBRE_CLIENTE = nombre;
                    editarTabla.NIT = nit;
                    editarTabla.DIRECCION = direccion;
                    editarTabla.TELEFONO = telefono;
                    editarTabla.DIRECCION = direccion;
                    db.Entry(editarTabla).State = EntityState.Modified;
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

        public JsonResult Inactivar(int id)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string queryValidarEstado = "SELECT ESTADO FROM CLIENTE WHERE ID_CLIENTE=" + id;
                    string estadoCliente = db.Database.SqlQuery<string>(queryValidarEstado).FirstOrDefault();
                    string estado = "A";

                    if (estadoCliente == "A")
                        estado = "I";

                    string query = "SELECT * FROM CLIENTE WHERE ID_CLIENTE = " + id;
                    var editarTabla = db.Database.SqlQuery<CLIENTE>(query).SingleOrDefault();
                    editarTabla.ESTADO = estado;
                    db.Entry(editarTabla).State = EntityState.Modified;
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


        public JsonResult CargarClientes()
        {
            try
            {
                string query = @"SELECT id_cliente,
                                       nombre_cliente,
                                       direccion,
                                       nit,
                                       telefono,
                                       estado,
                                       correo_electronico
                                FROM   cliente ";
                var lista = db.Database.SqlQuery<TABLA_CLIENTES>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        public class TABLA_CLIENTES
        {
            public int? ID_CLIENTE { set; get; }
            public string NOMBRE_CLIENTE { set; get; }
            public string DIRECCION { set; get; }
            public string NIT { set; get; }
            public string TELEFONO { set; get; }
            public string ESTADO { set; get; }
            public string CORREO_ELECTRONICO { set; get; }
        }
    }
}