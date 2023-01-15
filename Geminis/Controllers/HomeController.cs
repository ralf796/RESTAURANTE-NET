using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using BE;
using BLL;
using Geminis.Clases;

namespace Geminis.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult IniciarSesion(string usuario, string password)
        {
            try
            {
                Login_BE item = new Login_BE();
                item.USUARIO = usuario;
                item.PASSWORD = Encrypt.Instance.EncryptString(password.Trim().ToUpper());
                item.MTIPO = 1;
                var catUsuario = BackTools.Login_store_procedure(item).FirstOrDefault();
                if (catUsuario != null)
                {
                    Session["id_usuario"] = catUsuario.ID_USUARIO;
                    Session["usuario"] = catUsuario.USUARIO.ToString().ToUpper();
                    Session["nombre_usuario"] = catUsuario.NOMBRE.ToString();
                    Session["nombre_restaurante"] = catUsuario.RESTAURANTE.ToString().ToUpper();
                    Session["CodigoModulo"] = catUsuario.MODULO;
                    string urlDefault = "";
                    //var modulos = Home.Instance.ListarModulos(catUsuario.USUARIO);

                    item.MTIPO = 2;
                    item.ID_MODULO = catUsuario.MODULO;
                    var modulos = BackTools.Login_store_procedure(item);
                    if (modulos.Count > 0)
                    {
                        item.MTIPO = 3;
                        urlDefault = BackTools.Login_store_procedure(item).FirstOrDefault().URL;
                        //urlDefault = Home.Instance.ObtenerModulo(Convert.ToInt32(catUsuario.MODULO)).URL;
                    }
                    else
                    {
                        urlDefault = "/Home/Index";
                        return Json(new { Estado = -2, URL = urlDefault }, JsonRequestBehavior.AllowGet);
                    }
                    return Json(new { Estado = 1, URL = urlDefault }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { Estado = -1 }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Estado = -3, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ListarMenu()
        {
            var usuario = "";
            if (Session["usuario"] != null)
                usuario = Convert.ToString(Session["usuario"]);
            var codigoModulo = 0L;
            if (Session["CodigoModulo"] != null)
                codigoModulo = Convert.ToInt64(Session["CodigoModulo"]);

            var item = new Login_BE();
            item.ID_MODULO = Convert.ToInt32(codigoModulo);
            item.MTIPO = 3;
            var mod = BackTools.Login_store_procedure(item);
            //var mod = Home.Instance.ObtenerModulo(Convert.ToInt32(codigoModulo));

            item.ID_MODULO = Convert.ToInt32(codigoModulo);
            item.USUARIO = usuario;
            item.MTIPO = 2;
            var listadoMenu = BackTools.Login_store_procedure(item);
            //var listadoMenu = Home.Instance.ListarMenu(usuario, codigoModulo);
            return Json(new
            {
                Modulo = mod,
                Listado = listadoMenu
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ListarModulos()
        {
            var usuario = "";
            if (Session["usuario"] != null)
                usuario = Convert.ToString(Session["usuario"]);

            var item = new Login_BE();
            item.USUARIO = usuario;
            item.MTIPO = 5;
            var modulos = BackTools.Login_store_procedure(item);
            //var modulos = Home.Instance.ListarModulos(usuario);
            return Json(new { ListadoModulos = modulos }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ListarPantallas(string pantalla)
        {
            var usuario = "";
            if (Session["usuario"] != null)
                usuario = Convert.ToString(Session["usuario"]);

            var item = new Login_BE();
            item.PANTALLA = pantalla;
            item.USUARIO = usuario;
            item.MTIPO = 6;
            var pantallas = BackTools.Login_store_procedure(item);
            //var pantallas = Home.Instance.ListarPantallas(pantalla, usuario);

            return Json(new { ListadoPantallas = pantallas }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CerrarSesion()
        {
            FormsAuthentication.SignOut();
            Session.Abandon();
            return RedirectToAction("Index");
        }
    }
}