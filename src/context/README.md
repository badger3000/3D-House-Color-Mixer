# Context Directory

This directory contains documentation and context information for the 3D House Color Mixer project.

## Documentation Files

### `blender-integration.md`
Comprehensive guide for integrating Blender workflows with the 3D House Color Mixer. Covers:

- **Problem analysis** - Why single-mesh models limit color customization
- **Solution overview** - How to convert assets for multi-part control
- **Step-by-step instructions** - Complete workflow for asset conversion
- **Troubleshooting guide** - Common issues and solutions
- **Performance considerations** - Impact on rendering and memory

## Purpose

The context directory serves as a knowledge base for:

### **Asset Pipeline Documentation**
- 3D model requirements and specifications
- Conversion workflows and best practices
- Integration steps with the main application

### **Technical Decisions**
- Architecture choices and rationale
- Performance trade-offs and considerations
- Alternative approaches and why they were chosen/rejected

### **Troubleshooting Guides**
- Common issues developers might encounter
- Step-by-step solutions and workarounds
- Debugging techniques and tools

### **Integration Patterns**
- How external tools (like Blender) integrate with the project
- Workflow documentation for complex processes
- Best practices for maintaining consistency

## Usage

### For Developers
Reference these documents when:
- **Adding new 3D assets** to the project
- **Troubleshooting rendering issues** with models
- **Understanding the asset pipeline** and conversion process
- **Making architectural decisions** about 3D functionality

### For Content Creators
Use these guides when:
- **Creating new cottage models** for the application
- **Converting existing models** to work with multi-part coloring
- **Understanding technical requirements** for 3D assets
- **Optimizing models** for web performance

## File Organization

```
src/context/
├── README.md                    # This file - directory overview
├── blender-integration.md       # Blender workflow documentation
└── [future-docs]               # Additional context as project grows
```

## Contributing

When adding new context documentation:

### **File Naming**
- Use descriptive, kebab-case names
- Include relevant technology/tool names
- Follow pattern: `[tool/process]-[purpose].md`

### **Content Structure**
- **Overview section** - Brief summary of topic
- **Problem/Solution sections** - Clear problem statement and solution
- **Step-by-step instructions** - Detailed procedures
- **Troubleshooting** - Common issues and fixes
- **Examples** - Code snippets, commands, or screenshots

### **Cross-References**
- Link to related files in the project
- Reference main application code when relevant
- Include links to external tools and documentation

## Maintenance

### Regular Updates
- **Review accuracy** when project structure changes
- **Update screenshots** if UI changes significantly  
- **Verify external links** and tool versions
- **Add new troubleshooting items** as issues are discovered

### Version Control
- **Commit documentation changes** with descriptive messages
- **Tag major documentation updates** for easy reference
- **Keep change history** for tracking documentation evolution

## Future Documentation

Planned additions to this directory:

### **Asset Standards**
- 3D model quality guidelines
- Texture requirements and optimization
- Naming conventions for models and materials

### **Performance Optimization**
- WebGL rendering best practices
- Memory management for 3D assets
- Loading optimization strategies

### **Testing Procedures** 
- Model validation checklists
- Browser compatibility testing
- Performance benchmarking methods

### **Deployment Workflows**
- Asset deployment pipeline
- CDN integration for 3D models
- Version management for assets