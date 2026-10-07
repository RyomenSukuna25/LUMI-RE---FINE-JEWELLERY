const pexels = (id, w=1600) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const media = [
  pexels(8751528,2200), pexels(27954777), pexels(9509020), pexels(13038032), pexels(16082502), pexels(4295004),
  pexels(5442468), pexels(14466164), pexels(8398838), pexels(9953656), pexels(8680199), pexels(9953654),
  pexels(30746009), pexels(31605844), pexels(32652452), pexels(5370658), pexels(6993818), pexels(5370657),
  pexels(10475792), pexels(12145058), pexels(14558499), pexels(7419523), pexels(16987465), pexels(12168882),
  pexels(11064134), pexels(12194298), pexels(10803602), pexels(17555284), pexels(16438674), pexels(11335146),
  pexels(8100402), pexels(10835533), pexels(12753202), pexels(13155693), pexels(6716441), pexels(38773209),
  pexels(13595300), pexels(17184897), pexels(20203720), pexels(38740204), pexels(12194386), pexels(10983781),
  pexels(30888704), pexels(32096882), pexels(32077588), pexels(33222147), pexels(34399026), pexels(34479805),
  pexels(30162861), pexels(30734119), pexels(30541171), pexels(34444200), pexels(37485315), pexels(38780795),
  pexels(37298904), pexels(36339463), pexels(36339454), pexels(37549910), pexels(35187488), pexels(39919261),
  pexels(36160928), pexels(36160929), pexels(36189601), pexels(19647000), pexels(10050218), pexels(13645597),
  pexels(30888704), pexels(32989027), pexels(29502924), pexels(29502955), pexels(7541803), pexels(31459472),
  pexels(31605853), pexels(6716445), pexels(5370644), pexels(13292955), pexels(12194343), pexels(13787988),
];

export const heroLocal = '/assets/lumiere-hero-generated.png';

const names = [
  'Celeste','Aurelia','Solenne','Élyse','Nocturne','Lumina','Valence','Seraphine','Elara','Céleste','Amarante','Vesper','Isolde','Clair','Liora','Sienne','Aveline','Maëlle','Nerine','Opaline','Alba','Iris','Odette','Margaux','Estelle','Colette','Amélie','Lucienne','Vivienne','Camille','Juliette','Anaïs','Margot','Elodie','Sabine','Claire','Rosalie','Éloise','Valérie','Geneviève','Soline','Arielle','Beatrice','Louise','Celine','Noémie','Mireille','Fleur','Émeline','Adèle','Manon','Coralie','Léonie','Sophie','Mathilde','Chloé','Éva','Marine','Inès','Lou','Daphne','Aurélie','Amour','Belle','Lumière','Étoile','Éclat','Rêve','Douce','Soleil','Aube','Velours','Orée','Muse','Éternité','Lune','Rosée','Mirage','Nacre','Satin','Halo','Évidence','Rivière','Jardin','Mélodie','Renaissance','Constellation','Promise','Héritage','Maison','Élan','Grâce','Lueur','Sillage','Secret','Poème','Horizon','Silhouette','Signature','Écrin','Parure','Rhapsodie','Équinoxe','Aster','Seren','Violette','Citrine','Perle','Saphir','Rubis','Opal','Diamant','Onyx','Topaze','Garnet','Ivoire','Champagne','Noir','Velour','Gilded','Atelier','Archive','Nocturne II','Celeste II','Aurelia II','Solenne II','Liora II','Muse II','Éclat II','Sillage II'
];
const cats = ['Rings','Necklaces','Earrings','Bracelets','Sets'];
const tagSets = [['18K Gold','Diamond'],['18K Gold','Hand Finished'],['Lab-Grown Diamond','Platinum'],['14K Gold','Diamond'],['18K Gold','Pearl'],['Yellow Gold','Sapphire'],['Rose Gold','Diamond']];

export const products = names.map((name, i) => {
  const cat = cats[i % cats.length];
  const img = media[(i*3) % media.length];
  const alt = media[(i*3+1) % media.length];
  const third = media[(i*3+2) % media.length];
  const price = 18900 + (i % 19) * 4200 + Math.floor(i/19)*3100;
  return {
    id: `${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${i}`,
    name: `${name} ${['Ring','Necklace','Earrings','Bracelet','Set'][i%5]}`,
    cat, price, old: Math.round(price*1.18), img, alt, gallery:[img,alt,third],
    desc:'A considered silhouette designed around light, proportion and quiet craftsmanship. Finished by hand for a refined everyday presence.',
    tags:tagSets[i%tagSets.length], featured:i<12
  };
});

export const collections = [
  {name:'Rings', count:'120+ designs', image:media[6], intro:'Sculpted circles of light, from quiet bands to luminous solitaires.'},
  {name:'Necklaces', count:'90+ designs', image:media[2], intro:'Fine lines and considered pendants designed to move with you.'},
  {name:'Earrings', count:'80+ designs', image:media[17], intro:'Light-catching silhouettes with a precise, modern finish.'},
  {name:'Bracelets', count:'60+ designs', image:media[22], intro:'Soft structure, polished metal and details made for touch.'},
  {name:'Bridal', count:'40+ designs', image:media[43], intro:'Pieces for the moments that become part of the family archive.'},
  {name:'New Light', count:'24 pieces', image:media[48], intro:'A restrained new chapter in champagne gold and diamond.'},
];

export const journal = [
 {k:'01',title:'The art of wearing a story.',dek:'Why the pieces we keep are rarely only about the metal.',image:media[1]},
 {k:'02',title:'Light, cut and proportion.',dek:'A closer look at what makes a stone feel alive.',image:media[49]},
 {k:'03',title:'Inside the atelier.',dek:'The quiet gestures behind a hand-finished piece.',image:media[34]},
 {k:'04',title:'An Indian evening.',dek:'Bridal jewellery, memory and the architecture of celebration.',image:media[0]},
];
