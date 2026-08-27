<script setup>
import CabecalhoPagina from '@/components/CabecalhoPagina.vue'
import MarcaV from '@/components/MarcaV.vue'
import ChamadaDupla from '@/components/ChamadaDupla.vue'
import fotoComercio from '@/assets/fotos/comercio-bike.webp'
import { empresa } from '@/config/site'

/**
 * Área de atuação: Grande São Paulo.
 *
 * A sede fica em Vila Regina, na Zona Leste, mas sede não é cobertura — são
 * coisas diferentes e o texto mantém a distinção. Confundir as duas foi o que
 * fez a primeira versão deste site parecer uma operação de bairro.
 *
 * Os municípios listados são os da região metropolitana atendidos hoje.
 * Cidade listada é promessa de cobertura — conferir com a operação a cada
 * mudança de área.
 */
const zonas = [
  { nome: 'Zona Leste', desc: 'Onde fica a sede. É a região com mais entregador parceiro na rua.' },
  { nome: 'Centro', desc: 'Comércio de rua, galerias e escritório. Trânsito pede moto e bike.' },
  { nome: 'Zona Norte', desc: 'Bairro residencial e comércio de vizinhança.' },
  { nome: 'Zona Sul', desc: 'Da região central ao extremo, conforme o volume da rota.' },
  { nome: 'Zona Oeste', desc: 'Comércio de bairro e e-commerce com coleta na loja.' },
]

const metropolitana = [
  'Guarulhos',
  'Osasco',
  'Santo André',
  'São Bernardo do Campo',
  'São Caetano do Sul',
  'Diadema',
  'Barueri',
  'Taboão da Serra',
]
</script>

<template>
  <CabecalhoPagina
    parada="Área de atuação · Capital e região"
    titulo="A cidade inteira."
    :descricao="`A rede roda em toda a ${empresa.cobertura} — as cinco zonas da capital e os municípios da região metropolitana. Onde o seu cliente está, a entrega chega.`"
  />

  <section class="secao">
    <div class="container">
      <div class="area">
        <div>
          <div class="secao-cab">
            <h2 class="h2">Capital</h2>
            <span class="rotulo texto-2">Cinco zonas</span>
          </div>

          <ul class="zonas">
            <li v-for="(z, i) in zonas" :key="z.nome" v-revela="i * 60">
              <MarcaV variante="mono" :tamanho="12" class="z-v" />
              <div>
                <span class="z-nome">{{ z.nome }}</span>
                <span class="z-desc texto-2">{{ z.desc }}</span>
              </div>
            </li>
          </ul>

          <div class="metro" v-revela="200">
            <span class="rotulo texto-2 metro-tit">Região metropolitana</span>
            <ul class="metro-lista">
              <li v-for="m in metropolitana" :key="m" class="dado">{{ m }}</li>
            </ul>
          </div>

          <div class="fora corte-v" v-revela="260">
            <span class="rotulo fora-rotulo">Sua cidade não está aí?</span>
            <p class="corpo fora-txt">
              A rede cresce conforme a demanda aparece. Pergunte na central: se houver
              entregador parceiro rodando perto, dá para atender — e se não houver, a
              gente diz na hora, sem enrolar.
            </p>
            <v-btn to="/contato" color="primary" variant="flat" class="fora-btn">
              Perguntar sobre a minha região
            </v-btn>
          </div>
        </div>

        <div class="lado">
          <figure class="area-foto corte-v" v-revela="100">
            <img :src="fotoComercio" alt="Comércio de rua com bicicleta de entrega parada na porta" />
            <figcaption class="corpo-p texto-2">
              Comércio de rua é o cliente da Veiga — e a entrega sai da porta dele.
            </figcaption>
          </figure>

          <aside class="sede corte-v" v-revela="180">
            <span class="rotulo texto-2">Sede</span>
            <p class="h3 sede-end">
              {{ empresa.bairro }}, {{ empresa.baseRegiao }}<br />
              {{ empresa.cidade }}/{{ empresa.uf }}
            </p>
            <p class="corpo-p texto-2">
              É de onde a central despacha. A rede, essa está espalhada pela cidade —
              o entregador acionado é o que já está perto de você, não o que sai daqui.
            </p>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <ChamadaDupla />
</template>

<style scoped>
.area {
  display: grid;
  gap: 34px;
}
.zonas {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
}
.zonas li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 13px;
  padding: 15px 0;
  border-top: 1px solid var(--c-fio);
}
.zonas li:last-child {
  border-bottom: 1px solid var(--c-fio);
}
.z-v {
  color: var(--c-ambar);
  margin-top: 5px;
}
.z-nome {
  display: block;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.3;
}
.z-desc {
  display: block;
  margin-top: 3px;
  font-size: 13.5px;
  line-height: 1.5;
}

.metro {
  margin-top: 26px;
}
.metro-tit {
  display: block;
  margin-bottom: 12px;
}
.metro-lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.metro-lista li {
  font-size: 12px;
  padding: 8px 12px;
  background: var(--c-sup1);
  border: 1px solid var(--c-fio);
  color: var(--c-branco);
}

.fora {
  margin-top: 28px;
  padding: 22px 20px;
  background: var(--c-sup1);
  border: 1px solid var(--c-fio);
  display: grid;
  gap: 10px;
  justify-items: start;
}
.fora-rotulo {
  color: var(--c-ambar);
}
.fora-txt {
  max-width: 46ch;
  color: var(--c-cinza);
}
.fora-btn.v-btn {
  margin-top: 6px;
}

.lado {
  display: grid;
  gap: 20px;
  align-content: start;
}
.area-foto {
  margin: 0;
  overflow: hidden;
}
.area-foto img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  filter: url(#duotone-veiga);
}
.area-foto figcaption {
  margin-top: 10px;
  max-width: 38ch;
}
.sede {
  padding: 20px 18px;
  background: var(--c-sup1);
  border: 1px solid var(--c-fio);
  display: grid;
  gap: 8px;
}
.sede-end {
  margin: 0;
}

@media (min-width: 900px) {
  .area {
    grid-template-columns: 1.3fr 1fr;
    gap: 48px;
    align-items: start;
  }
  .area-foto img {
    height: 320px;
  }
}
</style>
