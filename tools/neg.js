global.window={};for(const l of ['hr','ba','rs'])require(require('path').join(__dirname,'../public/')+'data_'+l+'.js');
const E=require(require('path').join(__dirname,'../public/')+'engine.js');const D=window.PECAT;
const N={
'hr 1.1':'Zagreb,Split,Sicilija,Mallorca,Dubrovnik','hr 1.2':'Slavonija,Dalmacija,Istra županija?','hr 1.6':'Učka,Biokovo,Kopački rit,Medvednica',
'hr 2.4':'Plitvice,Krka,Kornati','hr 2.7':'nogomet,biciklizam,golf','hr 3.1':'Zagreb,Split,Karlovac','hr 4.1':'Čakovec,Vinkovci,Sisak,Zagreb',
'hr 5.5':'Ljubičić,Karlović,Martić,Ćorić,Đoković','hr 6.6':'Novska,Novalja,Zagreb','hr 8.4':'Osijek,Lokomotiva,Slaven Belupo,Varaždin',
'hr 8.5':'Austrija,Njemačka,Albanija','hr 9.2':'a,x,w,q','hr 10.4':'Varaždin,Šibenik,Mostar','hr 10.1':'Zagrebačka,Osječko-baranjska,Karlovačka',
'ba 1.6':'Jahorina,Blidinje,Hutovo blato','ba 3.3':'Vlašić,Kozara,Romanija','ba 7.1':'Sarajevo,Zenica,Brčko','ba 10.3':'Zenica,Trebinje,Bihać?',
'ba 8.4':'Republika Srpska,Brčko,Hercegovina','rs 1.5':'Zlatibor,Avala,Rtanj','rs 3.1':'Novi Sad,Niš,Beograd','rs 4.1':'Zagreb,Kragujevac,Niš,Pariz',
'rs 8.1':'Novska,Niš','rs 9.2':'a,w,x','rs 2.4':'Dinamo,Hajduk,Sarajevo','rs 7.3':'Jahorina,Bjelašnica','hr 7.4':'Messi,Ronaldo,Šuker,Boban',
'ba 2.2':'burek,sirnica,pizza','hr 5.3':'prstac,riba','hr 7.8':'plava,crna,crnom','rs 4.4':'Severina,Dino Merlin','hr 4.5':'Ceca,Konstrakta',
};
let bad=[];for(const k in N){const [l,dq]=k.split(' ');const [d,q]=dq.split('.').map(Number);const Q=D[l][d-1][q-1];
 for(const a of N[k].split(',')){if(a.endsWith('?'))continue;const r=E.check(Q,a,{});if(r.ok)bad.push(k+' "'+Q.q+'" PRIHVAĆA '+a+' -> '+r.text);}}
console.log(bad.length?bad.join('\n'):'nijedan krivi odgovor ne prolazi');
