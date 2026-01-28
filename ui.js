function renderPensum(){
  const container=document.getElementById("pensumContainer");
  container.innerHTML="";
  const completed=Storage.getCompleted();
  const notes=Storage.getNotes?Storage.getNotes():{};

  let total=0;
  pensum.forEach(c=>{
    const sec=document.createElement("section");
    sec.className="cycle";
    sec.innerHTML=`<h2>${c.ciclo}</h2>`;
    const grid=document.createElement("div");
    grid.className="subjects";

    c.materias.forEach(m=>{
      total++;
      const d=document.createElement("div");
      d.className="subject";
      
      const isCompleted=completed.includes(m);
      const note=notes[m];
      
      // Crear HTML con nombre y nota separados
      if(isCompleted && note){
        d.innerHTML=`
          <div class="subject-name">${m}</div>
          <div class="subject-note">📝 ${note}</div>
        `;
      } else {
        d.textContent=m;
      }
      
      if(isCompleted){
        d.classList.add("completed");
      }
      
      // Evitar doble click con data attribute
      d.dataset.processing="false";
      
      d.onclick=(e)=>{
        if(d.dataset.processing==="true") return;
        d.dataset.processing="true";
        
        if(isCompleted){
          // Desaprobar - mostrar modal
          showDisapproveDialog(m, ()=>{
            d.dataset.processing="false";
          });
        } else {
          // Aprobar - mostrar modal con nota
          showApproveDialog(m, ()=>{
            d.dataset.processing="false";
          });
        }
      };
      d.style.cursor="pointer";
      
      grid.appendChild(d);
    });

    sec.appendChild(grid);
    container.appendChild(sec);
  });

  updateProgress(completed.length,total);
}
