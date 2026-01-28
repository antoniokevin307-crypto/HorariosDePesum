self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("pensum-v1").then(c=>
      c.addAll(["./","./index.html"])
    )
  );
});
