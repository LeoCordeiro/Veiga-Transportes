<script setup>
import HeroHome from '@/components/HeroHome.vue'
import FaixaFatos from '@/components/FaixaFatos.vue'
import ListaNumerada from '@/components/ListaNumerada.vue'
import SegmentosFaixa from '@/components/SegmentosFaixa.vue'
import PassosEntrega from '@/components/PassosEntrega.vue'
import ModalidadesBloco from '@/components/ModalidadesBloco.vue'
import ChamadaDupla from '@/components/ChamadaDupla.vue'
import { diferenciais } from '@/config/site'
</script>

<template>
  <!-- O percurso da home, e o fundo alterna com ele: hero escuro → fatos
       claros → diferenciais escuros → segmentos claros → passos escuros →
       modalidades claras → chamada escura. O conjunto fecha em ~50/50, que é
       o que a direção aprovada pede. -->
  <HeroHome />
  <FaixaFatos />

  <ListaNumerada
    titulo="Por que a Veiga"
    rotulo="Seis motivos"
    :itens="diferenciais"
  />

  <SegmentosFaixa />
  <PassosEntrega />
  <ModalidadesBloco />
  <ChamadaDupla />
</template>
