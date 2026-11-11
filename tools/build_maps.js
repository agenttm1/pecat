const topo=require('topojson-client'),fs=require('fs');
const w10=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-10m.json'));
const fc=topo.feature(w10,w10.objects.countries);
const by={};fc.features.forEach(f=>by[f.properties.name]=f);
const CFG={
 hr:{name:'Croatia',lat0:44.5,lon0:16.5,pad:.35,cities:[['Zagreb',45.815,15.982],['Varaždin',46.305,16.336],['Osijek',45.554,18.695],['Vukovar',45.351,19.002],['Karlovac',45.487,15.548],['Gospić',44.546,15.375],['Split',43.508,16.44],['Dubrovnik',42.65,18.094]]},
 ba:{name:'Bosnia and Herz.',lat0:44,lon0:17.8,pad:.35,cities:[['Sarajevo',43.856,18.413],['Zenica',44.203,17.908],['Tuzla',44.538,18.676],['Banja Luka',44.772,17.191],['Bihać',44.817,15.871],['Livno',43.827,17.008],['Mostar',43.343,17.808],['Neum',42.923,17.616]]},
 rs:{name:'Serbia',lat0:44,lon0:20.9,pad:.35,cities:[['Novi Sad',45.267,19.833],['Subotica',46.1,19.665],['Beograd',44.787,20.457],['Kragujevac',44.012,20.911],['Kraljevo',43.725,20.689],['Užice',43.856,19.848],['Niš',43.32,21.896],['Beograd',44.80,20.50]]},
};
const NB=['Croatia','Bosnia and Herz.','Serbia','Slovenia','Hungary','Montenegro','Kosovo','Albania','Macedonia','North Macedonia','Romania','Bulgaria','Austria','Italy'];
const K=100;
function proj(c,lon,lat){return [ (lon-c.lon0)*Math.cos(c.lat0*Math.PI/180)*K, -(lat-c.lat0)*K ];}
function simplify(pts,tol){ // radial distance
  const out=[pts[0]];let last=pts[0];
  for(let i=1;i<pts.length-1;i++){const p=pts[i];if(Math.hypot(p[0]-last[0],p[1]-last[1])>=tol){out.push(p);last=p;}}
  out.push(pts[pts.length-1]);return out;}
function pathOf(c,f,tol,minArea,clip){
  const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;let d='';
  polys.forEach(poly=>{const ring=poly[0].map(([lo,la])=>proj(c,lo,la));
    let a=0;for(let i=0;i<ring.length-1;i++)a+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];
    if(Math.abs(a/2)<minArea)return;
    if(clip&&!ring.some(p=>p[0]>clip[0]&&p[0]<clip[0]+clip[2]&&p[1]>clip[1]&&p[1]<clip[1]+clip[3]))return;
    const s=simplify(ring,tol);if(s.length<3)return;
    d+='M'+s.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L')+'Z';});
  return d;}
const out={};
for(const k in CFG){const c=CFG[k],f=by[c.name];if(!f)throw k;
  const main=pathOf(c,f,1.0,0.3);
  let xs=[],ys=[];main.replace(/-?\d+\.\d/g,(m,i)=>0);
  const nums=main.match(/-?\d+\.\d/g).map(Number);for(let i=0;i<nums.length;i+=2){xs.push(nums[i]);ys.push(nums[i+1]);}
  const box=[Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)];
  const m=30;box[0]-=m;box[1]-=m;box[2]+=2*m;box[3]+=2*m;
  let nb='';NB.forEach(n=>{if(n===c.name||!by[n])return;nb+=pathOf(c,by[n],3.5,4,[box[0]-80,box[1]-80,box[2]+160,box[3]+160]);});
  out[k]={main,nb,box:box.map(v=>+v.toFixed(1)),cities:c.cities.map(([n,la,lo])=>[n,...proj(c,lo,la).map(v=>+v.toFixed(1))])};
  console.log(k,'main',main.length,'nb',nb.length,'box',out[k].box.join(' '));
}
fs.writeFileSync(require('path').join(__dirname,'../public/')+'maps.js','window.PECAT_MAPS='+JSON.stringify(out)+';\n');
console.log('bytes',fs.statSync(require('path').join(__dirname,'../public/')+'maps.js').size);
