import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Playbook from './Playbook'
import PlaybookIntro from './components/PlaybookIntro'
import './styles.css'
import { UIProvider } from './theme/UIContext.jsx'
import IntroDoc from './components/docs/01-intro';
import EvolutionOfASRDoc from './components/docs/02-evolution-of-asr';
import BackgroundOfASRDoc from './components/docs/03-background-of-asr';
import DatasetCreationGuidelinesDoc from './components/docs/04-dataset-creation-guidelines';
import IMetadataDoc from './components/docs/04-i-metadata';
import IiCurationForDiversityDoc from './components/docs/04-ii-curation-for-diversity';
import IiiGeneralizationVsDomainDoc from './components/docs/04-iii-generalization-vs-domain';
import IvQualityControlDoc from './components/docs/04-iv-quality-control';
import DataFormatsStructuresDoc from './components/docs/05-data-formats-structures';
import DataPreprocessingDoc from './components/docs/06-data-preprocessing';
import DataCompressionDoc from './components/docs/07-data-compression';
import ModelFinetuningIntroDoc from './components/docs/08-model-finetuning-intro';
import IModelSelectionDoc from './components/docs/08-i-model-selection';
import IiFullFinetuningDoc from './components/docs/08-ii-full-finetuning';
import IiiPeftDoc from './components/docs/08-iii-peft';
import IvDecisionMatrixDoc from './components/docs/08-iv-decision-matrix';
import InferenceDoc from './components/docs/09-inference';
import DataAugmentationDoc from './components/docs/10-data-augmentation';
import CommonFinetuningChallengesDoc from './components/docs/11-common-finetuning-challenges';
import ConclusionDoc from './components/docs/12-conclusion';
import ComingSoonDoc from './components/docs/13-coming-soon';
import AttributionDoc from './components/docs/14-attribution';
import ReferencesDoc from './components/docs/15-references';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route element={<Playbook />}>
              <Route index element={<PlaybookIntro />} />
              <Route path="playbook">
                <Route path="/playbook/01-intro" element={<IntroDoc />} />
                <Route path="/playbook/02-evolution-of-asr" element={<EvolutionOfASRDoc />} />
                <Route path="/playbook/03-background-of-asr" element={<BackgroundOfASRDoc />} />
                <Route path="/playbook/04-dataset-creation-guidelines" element={<DatasetCreationGuidelinesDoc />} />
                <Route path="/playbook/04-i-metadata" element={<IMetadataDoc />} />
                <Route path="/playbook/04-ii-curation-for-diversity" element={<IiCurationForDiversityDoc />} />
                <Route path="/playbook/04-iii-generalization-vs-domain" element={<IiiGeneralizationVsDomainDoc />} />
                <Route path="/playbook/04-iv-quality-control" element={<IvQualityControlDoc />} />
                <Route path="/playbook/05-data-formats-structures" element={<DataFormatsStructuresDoc />} />
                <Route path="/playbook/06-data-preprocessing" element={<DataPreprocessingDoc />} />
                <Route path="/playbook/07-data-compression" element={<DataCompressionDoc />} />
                <Route path="/playbook/08-model-finetuning-intro" element={<ModelFinetuningIntroDoc />} />
                <Route path="/playbook/08-i-model-selection" element={<IModelSelectionDoc />} />
                <Route path="/playbook/08-ii-full-finetuning" element={<IiFullFinetuningDoc />} />
                <Route path="/playbook/08-iii-peft" element={<IiiPeftDoc />} />
                <Route path="/playbook/08-iv-decision-matrix" element={<IvDecisionMatrixDoc />} />
                <Route path="/playbook/09-inference" element={<InferenceDoc />} />
                <Route path="/playbook/10-data-augmentation" element={<DataAugmentationDoc />} />
                <Route path="/playbook/11-common-finetuning-challenges" element={<CommonFinetuningChallengesDoc />} />
                <Route path="/playbook/12-conclusion" element={<ConclusionDoc />} />
                <Route path="/playbook/13-coming-soon" element={<ComingSoonDoc />} />
                <Route path="/playbook/14-attribution" element={<AttributionDoc />} />
                <Route path="/playbook/15-references" element={<ReferencesDoc />} />
                <Route index element={<PlaybookIntro />} />
            </Route>
            </Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </UIProvider>
  </React.StrictMode>
);
