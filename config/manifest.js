'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://github.com/zonkyio/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: "Booker",
    short_name: "Booker",
    description: "Point and click adventure game in the world of Frank Booker and his criminal investigation",
    start_url: "/",
    display: "standalone",
    orientation: "landscape",
    background_color: "#fff",
    theme_color: "#e50000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "242x256",
        type: "image/ico"
      }, 
      // {
      //   src: "/assets/images/icon-192.png",
      //   sizes: "192x192",
      //   type: "image/png"
      // }, {
      //   src: "/assets/images/icon-512.png",
      //   sizes: "512x512",
      //   type: "image/png"
      // }
    ],
    ms: {
      tileColor: '#fff'
    }
  };
}
