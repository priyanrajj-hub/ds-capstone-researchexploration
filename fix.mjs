import fs from 'fs';
['components/SpaceComplexitySlider.tsx', 'components/SimulationRace.tsx', 'components/GraphScene.tsx', 'components/AppGallery.tsx', 'app/page.tsx'].forEach(file => {
    if (fs.existsSync(file)) {
        let c = fs.readFileSync(file, 'utf8');
        c = c.replace(/\\\${/g, '${');
        fs.writeFileSync(file, c);
    }
});
