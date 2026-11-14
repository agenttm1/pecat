const E=require(require('path').join(__dirname,'../public/')+'engine.js');
global.window={};
for(const l of ['hr','ba','rs']) {require(require('path').join(__dirname,'../public/')+'data_'+l+'.js');require(require('path').join(__dirname,'../public/')+'data_'+l+'2.js');}
const D=window.PECAT; let bad=0, nq=0, closed=0, small=[];
for(const l of ['hr','ba','rs']){
  if(D[l].length!==23){console.log('DAYS',l,D[l].length);bad++}
  D[l].forEach((day,di)=>{ if(day.length!==8){console.log('LEN',l,di+1,day.length);bad++}
    day.forEach((q,qi)=>{nq++; E.build(q); if(!q.o)closed++; if(!q.q||!q.f){console.log('EMPTY',l,di,qi);bad++}
      if(q._list.length<4){small.push(l+' d'+(di+1)+' q'+(qi+1)+' n='+q._list.length)} });});
}
console.log('questions',nq,'closed',closed,'small lists:',small.join(' | ')||'none');
const T=[
['hr',1,1,'susak'],['hr',1,1,'otok krk'],['hr',1,2,'viroviticko podravska zupanija'],['hr',1,3,'Pogača s orasima'],['hr',1,4,'gospic'],['hr',1,5,'Mirna'],['hr',1,6,'np risnjak'],['hr',1,6,'Plitvice'],
['hr',2,1,'Buzet'],['hr',2,2,'pulenat'],['hr',2,3,'rafioli'],['hr',2,4,'lastovsko otocje'],['hr',2,5,'velebitsko pivo'],['hr',2,6,'daktiloskopija'],['hr',2,7,'dizanje utega'],['hr',2,8,'tijelovo'],
['hr',3,1,'Kutjevo'],['hr',3,2,'kantar'],['hr',3,3,'psunj'],['hr',3,5,'nasi i vasi'],['hr',3,6,'armerun'],['hr',4,1,'Obrovac'],['hr',4,2,'crveno jezero'],['hr',4,3,'škripavac'],['hr',4,4,'PŽ'],['hr',4,4,'zg'],
['hr',4,5,'danijela'],['hr',4,6,'sopile'],['hr',4,7,'smilje'],['hr',5,1,'vrlika'],['hr',5,2,'paski most'],['hr',5,3,'kunjka'],['hr',5,4,'bogdanusa'],['hr',5,5,'pavic'],['hr',5,6,'jazavac'],['hr',5,7,'djakovacki vezovi'],
['hr',6,1,'podsused'],['hr',6,2,'stjepan drzislav'],['hr',6,3,'smudj'],['hr',6,4,'zivotinjsko carstvo'],['hr',6,5,'stecci'],['hr',6,6,'novi marof'],['hr',7,1,'vrbovsko'],['hr',7,2,'lindjo'],['hr',7,3,'koraba'],['hr',7,4,'strinic'],
['hr',7,5,'smokovaca'],['hr',7,6,'stiniva'],['hr',7,7,'bjeloglavi sup'],['hr',7,8,'zlatna'],['hr',8,1,'ilovik'],['hr',8,2,'pipi'],['hr',8,4,'nk zagreb'],['hr',8,5,'italija'],['hr',8,6,'musmula'],['hr',8,7,'prizna'],
['hr',9,1,'prelog'],['hr',9,2,'dž'],['hr',9,2,'č'],['hr',9,3,'svibanj'],['hr',9,4,'metlicic'],['hr',9,6,'periska'],['hr',9,7,'stara mati'],['hr',10,1,'licko-senjska'],['hr',10,2,'pljukanci'],['hr',10,3,'kranjcevic'],['hr',10,4,'zracna luka losinj'],['hr',10,6,'regoc'],['hr',10,7,'bezanec'],
['ba',1,1,'gradacac'],['ba',1,2,'sana'],['ba',1,3,'tikvenica'],['ba',1,4,'vranica'],['ba',1,6,'drina'],['ba',2,1,'ljubuski'],['ba',2,2,'klepe'],['ba',2,3,'prokosko jezero'],['ba',2,5,'igman'],['ba',2,6,'amel tuka'],['ba',2,7,'serbe'],['ba',2,8,'dan drzavnosti'],
['ba',3,1,'bosanska krupa'],['ba',3,2,'sir iz mijeha'],['ba',3,3,'trebevic'],['ba',3,4,'kozja cuprija'],['ba',3,5,'viza za buducnost'],['ba',3,6,'himzo polovina'],['ba',3,7,'sahadzija'],['ba',4,1,'fojnica'],['ba',4,2,'sogan dolma'],['ba',4,3,'hurmasica'],
['ba',4,4,'divanhana'],['ba',4,5,'skakavac'],['ba',4,6,'biatlon'],['ba',5,1,'rogatica'],['ba',5,2,'dunja'],['ba',5,3,'dunjevaca'],['ba',5,4,'djevrek'],['ba',5,5,'hari mata hari'],['ba',5,6,'divokoza'],['ba',6,1,'otoka'],['ba',6,3,'vranduk'],['ba',6,4,'stjepan tomasevic'],['ba',6,4,'kulin ban'],
['ba',6,5,'laka'],['ba',6,6,'jelek'],['ba',7,1,'kladanj'],['ba',7,2,'bamija'],['ba',7,3,'banja vrucica'],['ba',7,4,'zuko dzumhur'],['ba',7,5,'teletovic'],['ba',7,7,'musandera'],['ba',8,1,'sana'],['ba',8,2,'teleca corba'],['ba',8,3,'besic'],['ba',8,4,'bosansko-podrinjski kanton'],
['ba',8,5,'kod amidze idriza'],['ba',8,6,'preminger'],['ba',8,7,'djuture'],['ba',9,1,'gradiska'],['ba',9,3,'dž'],['ba',9,4,'secerluk'],['ba',9,5,'stiglic'],['ba',9,6,'tursija'],['ba',10,1,'berkovici'],['ba',10,3,'mostar'],['ba',10,4,'zute dunje'],['ba',10,7,'nena'],
['rs',1,1,'pirot'],['rs',1,2,'toplica'],['rs',1,3,'koljivo'],['rs',1,4,'rtanj'],['rs',1,5,'djerdap'],['rs',1,7,'gitarijada'],['rs',2,1,'kikinda'],['rs',2,3,'vlasinsko jezero'],['rs',2,4,'spartak subotica'],['rs',2,5,'zimonjic'],['rs',2,6,'pindjur'],['rs',2,7,'viljamovka'],['rs',2,8,'dan primirja'],
['rs',3,1,'raca'],['rs',3,2,'oblande'],['rs',3,3,'vruc vetar'],['rs',3,4,'prolom banja'],['rs',3,5,'milankovic'],['rs',3,6,'djevrek'],['rs',3,7,'lepa sela lepo gore'],['rs',4,1,'golubac'],['rs',4,2,'homoljski sir'],['rs',4,3,'ram'],['rs',4,4,'luke black'],['rs',4,5,'smak'],['rs',4,6,'bamija'],['rs',4,7,'pendzer'],
['rs',5,1,'surdulica'],['rs',5,2,'peglana kobasica'],['rs',5,3,'lazarev kanjon'],['rs',5,4,'paspalj'],['rs',5,5,'gajde'],['rs',5,7,'curka'],['rs',6,1,'karaburma'],['rs',6,2,'despot stefan lazarevic'],['rs',6,2,'цар душан'],['rs',6,3,'dunja'],['rs',6,4,'gamzigrad'],['rs',6,5,'laza kostic'],
['rs',7,1,'priboj'],['rs',7,3,'divcibare'],['rs',7,4,'kostic'],['rs',7,5,'smor'],['rs',7,7,'nisville'],['rs',8,1,'novi becej'],['rs',8,3,'kraljevo'],['rs',8,4,'jelek'],['rs',8,5,'albanija'],['rs',8,6,'svraka'],['rs',8,7,'fazoni i fore'],
['rs',9,1,'kosjeric'],['rs',9,2,'dž'],['rs',9,3,'kajak'],['rs',9,4,'nes'],['rs',9,5,'toma zdravkovic'],['rs',9,7,'letnja kuhinja'],['rs',10,1,'homolje'],['hr',11,1,'mup'],['hr',13,6,'bela'],['hr',20,1,'karlovac'],['hr',16,7,'insta'],['hr',21,8,'sahovnica'],['ba',13,7,'golf'],['ba',12,1,'bihac'],['ba',14,3,'jahorina'],['rs',13,5,'pare'],['rs',22,1,'zlatibor'],['rs',20,8,'bg'],['rs',21,3,'sitonija'],['rs',23,4,'nikoljdan'],['rs',10,2,'zito'],['rs',10,3,'manasija'],['rs',10,7,'protekcija'],['rs',10,8,'nana'],
];
for(const [l,d,q,inp] of T){const r=E.check(D[l][d-1][q-1],inp,{}); if(!r.ok){bad++;console.log('FAIL',l,d,q,inp,r.reason)}}
const neg=[['hr',1,1,'zagreb'],['hr',5,3,'prstac'],['ba',2,2,'burek'],['hr',7,8,'plava'],['hr',1,6,'ucka'],['rs',1,5,'zlatibor'],['hr',8,5,'austrija']];
for(const [l,d,q,inp] of neg){const r=E.check(D[l][d-1][q-1],inp,{}); if(r.ok){bad++;console.log('SHOULD FAIL',l,d,q,inp,r.text)}}
const q=D.hr[0][0]; console.log('pct Krk',E.check(q,'krk').pct,'Susak',E.check(q,'susak').pct,'typo',E.check(q,'korcla').text);
console.log('dup',E.check(q,'Krk',{'a:krk':1}).reason,'reached',[0,94,95,560,759,760,800].map(E.reached).join(','));
console.log(bad?('PROBLEMS '+bad):'ALL OK');
