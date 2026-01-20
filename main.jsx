import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Playbook from './Playbook'
import PlaybookIntro from './components/PlaybookIntro'
import './styles.css'

// Docs markdown components
import IntroDoc from './components/docs/01-intro'
import EvolutionOfASRDoc from './components/docs/02-evolution-of-asr'
import BackgroundOfASRDoc from './components/docs/03-background-of-asr'
import DatasetCreationGuidelinesDoc from './components/docs/04-dataset-creation-guidelines'
import IMetadataDoc from './components/docs/04-i-metadata'
import IiCurationForDiversityDoc from './components/docs/04-ii-curation-for-diversity'
import IiiGeneralizationVsDomainDoc from './components/docs/04-iii-generalization-vs-domain'
import IvQualityControlDoc from './components/docs/04-iv-quality-control'
import DataFormatsStructuresDoc from './components/docs/05-data-formats-structures'
import DataPreprocessingDoc from './components/docs/06-data-preprocessing'
import DataCompressionDoc from './components/docs/07-data-compression'
import ModelFinetuningIntroDoc from './components/docs/08-model-finetuning-intro'
import IModelSelectionDoc from './components/docs/08-i-model-selection'
import IiFullFinetuningDoc from './components/docs/08-ii-full-finetuning'
import IiiPeftDoc from './components/docs/08-iii-peft'
import IvDecisionMatrixDoc from './components/docs/08-iv-decision-matrix'
import InferenceDoc from './components/docs/09-inference'
import DataAugmentationDoc from './components/docs/10-data-augmentation'
import CommonFinetuningChallengesDoc from './components/docs/11-common-finetuning-challenges'
import ConclusionDoc from './components/docs/12-conclusion'
import ComingSoonDoc from './components/docs/13-coming-soon'
import AttributionDoc from './components/docs/14-attribution'
import ReferencesDoc from './components/docs/15-references'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Always wrap content with Playbook layout to show Sidebar */}
          <Route element={<Playbook />}>
            {/* Root shows PlaybookIntro with sidebar */}
            <Route index element={<PlaybookIntro />} />
            <Route path="playbook">
              <Route index element={<PlaybookIntro />} />
              {/* Docs markdown routes */}
            <Route path="01-intro" element={<IntroDoc />} />
            <Route path="02-evolution-of-asr" element={<EvolutionOfASRDoc />} />
            <Route path="03-background-of-asr" element={<BackgroundOfASRDoc />} />
            <Route path="04-dataset-creation-guidelines" element={<DatasetCreationGuidelinesDoc />} />
            <Route path="04-i-metadata" element={<IMetadataDoc />} />
            <Route path="04-ii-curation-for-diversity" element={<IiCurationForDiversityDoc />} />
            <Route path="04-iii-generalization-vs-domain" element={<IiiGeneralizationVsDomainDoc />} />
            <Route path="04-iv-quality-control" element={<IvQualityControlDoc />} />
            <Route path="05-data-formats-structures" element={<DataFormatsStructuresDoc />} />
            <Route path="06-data-preprocessing" element={<DataPreprocessingDoc />} />
            <Route path="07-data-compression" element={<DataCompressionDoc />} />
            <Route path="08-model-finetuning-intro" element={<ModelFinetuningIntroDoc />} />
            <Route path="08-i-model-selection" element={<IModelSelectionDoc />} />
            <Route path="08-ii-full-finetuning" element={<IiFullFinetuningDoc />} />
            <Route path="08-iii-peft" element={<IiiPeftDoc />} />
            <Route path="08-iv-decision-matrix" element={<IvDecisionMatrixDoc />} />
            <Route path="09-inference" element={<InferenceDoc />} />
            <Route path="10-data-augmentation" element={<DataAugmentationDoc />} />
            <Route path="11-common-finetuning-challenges" element={<CommonFinetuningChallengesDoc />} />
            <Route path="12-conclusion" element={<ConclusionDoc />} />
            <Route path="13-coming-soon" element={<ComingSoonDoc />} />
            <Route path="14-attribution" element={<AttributionDoc />} />
            <Route path="15-references" element={<ReferencesDoc />} />
          </Route>
          </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
