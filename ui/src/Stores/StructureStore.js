import { observable, action, computed, runInAction } from "mobx";
import { sortBy, groupBy } from "lodash";
import API from "../Services/API";

const mockup = {
  "schemas": [
    {
      "id": "hbpkg/core/bookmarklistfolder/v0.0.1",
      "group": "hbpkg",
      "label": "Bookmarklistfolder",
      "properties": [
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "folderType",
          "attribute": "https://schema.hbp.eu/hbpkg/folderType",
          "label": "Folder type"
        },
        {
          "numOfOccurences": 100,
          "canBe": [
            "hbpkg/core/user/v0.0.1"
          ],
          "simpleAttributeName": "user",
          "attribute": "https://schema.hbp.eu/hbpkg/user",
          "label": "User"
        },
        {
          "numOfOccurences": 45,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 45,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 100,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "bookmarkListFolder",
          "canBe": [
            "hbpkg/core/bookmarklist/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkListFolder",
          "label": "Bookmark list folder",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/placomponent/v1.0.0",
      "group": "minds",
      "label": "Placomponent",
      "properties": [
        {
          "numOfOccurences": 2403,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2403,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 2371,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 2398,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 2403,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2403,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2371,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 2403,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2403,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2403,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "v1.0.0",
          "canBe": [
            "cscs/core/file/v1.0.0"
          ],
          "attribute": "minds/core/fileassociation/v1.0.0",
          "label": "V 1 . 0 . 0",
          "reverse": true
        },
        {
          "simplePropertyName": "component",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/component",
          "label": "Component",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "bookmarkInstanceLink",
          "canBe": [
            "hbpkg/core/bookmark/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkInstanceLink",
          "label": "Bookmark instance link",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/options/programminglanguage/v1.0.0",
      "group": "softwarecatalog",
      "label": "Programminglanguage",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "encodingFormat",
          "canBe": [
            "softwarecatalog/software/software/v0.1.2"
          ],
          "attribute": "http://schema.org/encodingFormat",
          "label": "Encoding format",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/softwareagent/v1.0.0",
      "group": "minds",
      "label": "Softwareagent",
      "properties": [
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "agent",
          "canBe": [
            "minds/core/sex/v1.0.0",
            "minds/experiment/subject/v1.0.0",
            "minds/core/dataset/v1.0.0",
            "minds/experiment/sample/v1.0.0",
            "minds/core/parcellationregion/v1.0.0",
            "minds/core/activity/v1.0.0",
            "minds/ethics/authority/v1.0.0",
            "minds/ethics/approval/v1.0.0",
            "minds/experiment/method/v1.0.0",
            "minds/core/placomponent/v1.0.0",
            "minds/core/person/v1.0.0",
            "minds/experiment/protocol/v1.0.0",
            "minds/core/publication/v1.0.0",
            "minds/core/specimengroup/v1.0.0",
            "minds/core/parcellationatlas/v1.0.0",
            "minds/core/preparation/v1.0.0",
            "minds/core/species/v1.0.0",
            "minds/core/referencespace/v1.0.0",
            "minds/core/format/v1.0.0",
            "minds/core/embargostatus/v1.0.0",
            "minds/core/licensetype/v1.0.0",
            "minds/core/agecategory/v1.0.0",
            "minds/core/method/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#agent",
          "label": "Agent",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/experiment/wholecellpatchclamp/v0.1.0",
      "group": "neuralactivity",
      "label": "Wholecellpatchclamp",
      "properties": [
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 75,
          "canBe": [
            "neuralactivity/experiment/patchedslice/v0.1.0"
          ],
          "simpleAttributeName": "generated",
          "attribute": "http://www.w3.org/ns/prov#generated",
          "label": "Generated"
        },
        {
          "numOfOccurences": 75,
          "canBe": [
            "neuralactivity/core/slice/v0.1.0"
          ],
          "simpleAttributeName": "used",
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used"
        },
        {
          "numOfOccurences": 73,
          "canBe": [
            "neuralactivity/core/person/v0.1.0"
          ],
          "simpleAttributeName": "wasAssociatedWith",
          "attribute": "http://www.w3.org/ns/prov#wasAssociatedWith",
          "label": "Was associated with"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "ontologies/core/monomericionchannel/v1.0.0",
      "group": "ontologies",
      "label": "Monomericionchannel",
      "properties": [
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 23,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 35,
          "canBe": [
            "ontologies/core/monomericionchannel/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 30,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/monomericionchannel/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "demo/core/person/v1.0.0",
      "group": "demo",
      "label": "Person",
      "properties": [
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "familyName",
          "attribute": "http://schema.org/familyName",
          "label": "Family name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "givenName",
          "attribute": "http://schema.org/givenName",
          "label": "Given name"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "contributor",
          "canBe": [
            "demo/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/demo/contributor",
          "label": "Contributor",
          "reverse": true
        },
        {
          "simplePropertyName": "custodian",
          "canBe": [
            "demo/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/demo/custodian",
          "label": "Custodian",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/multimericionchannel/v1.0.0",
      "group": "ontologies",
      "label": "Multimericionchannel",
      "properties": [
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 271,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "acronym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 205,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 202,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 130,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 271,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 38,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 271,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 271,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "changeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#changeNote",
          "label": "Change note"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 202,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "acronym",
          "attribute": "https://schema.hbp.eu/ontologies/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 279,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 475,
          "canBe": [
            "ontologies/core/multimericionchannel/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 401,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 476,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/multimericionchannel/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/activity/v1.0.0",
      "group": "minds",
      "label": "Activity",
      "properties": [
        {
          "numOfOccurences": 303,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 303,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 197,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 214,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 303,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 301,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 197,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 144,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 197,
          "simpleAttributeName": "created_at",
          "attribute": "https://schema.hbp.eu/minds/created_at",
          "label": "Created at"
        },
        {
          "numOfOccurences": 199,
          "canBe": [
            "minds/ethics/approval/v1.0.0"
          ],
          "simpleAttributeName": "ethicsApproval",
          "attribute": "https://schema.hbp.eu/minds/ethicsApproval",
          "label": "Ethics approval"
        },
        {
          "numOfOccurences": 268,
          "canBe": [
            "minds/ethics/authority/v1.0.0"
          ],
          "simpleAttributeName": "ethicsAuthority",
          "attribute": "https://schema.hbp.eu/minds/ethicsAuthority",
          "label": "Ethics authority"
        },
        {
          "numOfOccurences": 282,
          "canBe": [
            "minds/experiment/method/v1.0.0"
          ],
          "simpleAttributeName": "methods",
          "attribute": "https://schema.hbp.eu/minds/methods",
          "label": "Methods"
        },
        {
          "numOfOccurences": 277,
          "canBe": [
            "minds/core/preparation/v1.0.0"
          ],
          "simpleAttributeName": "preparation",
          "attribute": "https://schema.hbp.eu/minds/preparation",
          "label": "Preparation"
        },
        {
          "numOfOccurences": 273,
          "canBe": [
            "minds/experiment/protocol/v1.0.0"
          ],
          "simpleAttributeName": "protocols",
          "attribute": "https://schema.hbp.eu/minds/protocols",
          "label": "Protocols"
        },
        {
          "numOfOccurences": 96,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 96,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 303,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 303,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 303,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "activity",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/activity",
          "label": "Activity",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/softwareproject/v0.1.0",
      "group": "softwarecatalog",
      "label": "Softwareproject",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "project",
          "canBe": [
            "softwarecatalog/software/software/v0.1.2"
          ],
          "attribute": "http://schema.org/project",
          "label": "Project",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/studytargettype/v1.0.0",
      "group": "uniminds",
      "label": "Studytargettype",
      "properties": [
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "studyTargetType",
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/studyTargetType",
          "label": "Study target type",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/core/organization/v0.1.0",
      "group": "neuralactivity",
      "label": "Organization",
      "properties": [
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "address",
          "attribute": "http://schema.org/address",
          "label": "Address"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "organization",
          "canBe": [
            "neuralactivity/simulation/modelproject/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/organization",
          "label": "Organization",
          "reverse": true
        },
        {
          "simplePropertyName": "affiliation",
          "canBe": [
            "neuralactivity/core/person/v0.1.0"
          ],
          "attribute": "http://schema.org/affiliation",
          "label": "Affiliation",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/memodel/v0.1.2",
      "group": "modelvalidation",
      "label": "Memodel",
      "properties": [
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 107,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "version",
          "attribute": "http://schema.org/version",
          "label": "Version"
        },
        {
          "numOfOccurences": 514,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 516,
          "canBe": [
            "modelvalidation/simulation/emodel/v0.1.1"
          ],
          "simpleAttributeName": "eModel",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/eModel",
          "label": "E model"
        },
        {
          "numOfOccurences": 516,
          "canBe": [
            "modelvalidation/simulation/emodelscript/v0.1.0"
          ],
          "simpleAttributeName": "mainModelScript",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/mainModelScript",
          "label": "Main model script"
        },
        {
          "numOfOccurences": 499,
          "simpleAttributeName": "modelOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/modelOf",
          "label": "Model of"
        },
        {
          "numOfOccurences": 516,
          "canBe": [
            "modelvalidation/simulation/morphology/v0.1.1"
          ],
          "simpleAttributeName": "morphology",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/morphology",
          "label": "Morphology"
        },
        {
          "numOfOccurences": 163,
          "simpleAttributeName": "parameters",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/parameters",
          "label": "Parameters"
        },
        {
          "numOfOccurences": 513,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 507,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "generatedAtTime",
          "attribute": "https://schema.hbp.eu/modelvalidation/simulation/memodel/v0.1.2/generatedAtTime",
          "label": "Generated at time"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "modelvalidation/simulation/modelvalidation/v0.2.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        },
        {
          "simplePropertyName": "hasPart",
          "canBe": [
            "modelvalidation/simulation/modelproject/v0.1.0"
          ],
          "attribute": "http://purl.org/dc/terms/hasPart",
          "label": "Has part",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/options/operatingsystem/v1.0.0",
      "group": "softwarecatalog",
      "label": "Operatingsystem",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "screenshot",
          "attribute": "http://schema.org/screenshot",
          "label": "Screenshot"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "operatingSystem",
          "canBe": [
            "softwarecatalog/software/software/v0.1.2",
            "softwarecatalog/software/software/v1.0.0"
          ],
          "attribute": "http://schema.org/operatingSystem",
          "label": "Operating system",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/cellpart/v1.0.0",
      "group": "ontologies",
      "label": "Cellpart",
      "properties": [
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1169,
          "simpleAttributeName": "created_by",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#created_by",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1167,
          "simpleAttributeName": "creation_date",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#creation_date",
          "label": "Creation date"
        },
        {
          "numOfOccurences": 117,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 176,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 550,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 1380,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 471,
          "simpleAttributeName": "hasNarrowSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym",
          "label": "Has narrow synonym"
        },
        {
          "numOfOccurences": 3276,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 305,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 3477,
          "canBe": [
            "ontologies/core/cellpart/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 1887,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3478,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/cellpart/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/electrophysiology/tracegeneration/v0.1.0",
      "group": "neuralactivity",
      "label": "Tracegeneration",
      "properties": [
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 26,
          "canBe": [
            "neuralactivity/electrophysiology/stimulusexperiment/v0.1.0"
          ],
          "simpleAttributeName": "activity",
          "attribute": "http://www.w3.org/ns/prov#activity",
          "label": "Activity"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "sweep",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/sweep",
          "label": "Sweep"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "targetHoldingPotential",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/targetHoldingPotential",
          "label": "Target holding potential"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "qualifiedGeneration",
          "canBe": [
            "neuralactivity/electrophysiology/trace/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#qualifiedGeneration",
          "label": "Qualified generation",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/agecategory/v1.0.0",
      "group": "uniminds",
      "label": "Agecategory",
      "properties": [
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "minds/core/agecategory/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "ageCategory",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/ageCategory",
          "label": "Age category",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/emodelscript/v0.1.0",
      "group": "modelvalidation",
      "label": "Emodelscript",
      "properties": [
        {
          "numOfOccurences": 617,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 617,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 604,
          "simpleAttributeName": "distribution",
          "attribute": "http://schema.org/distribution",
          "label": "Distribution"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "license",
          "attribute": "http://schema.org/license",
          "label": "License"
        },
        {
          "numOfOccurences": 617,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 469,
          "simpleAttributeName": "code_format",
          "attribute": "https://schema.hbp.eu/modelvalidation/simulation/emodelscript/v0.1.0/code_format",
          "label": "Code format"
        },
        {
          "numOfOccurences": 617,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 617,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 617,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "mainModelScript",
          "canBe": [
            "modelvalidation/simulation/memodel/v0.1.2",
            "modelvalidation/simulation/modelinstance/v0.1.1"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/mainModelScript",
          "label": "Main model script",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/subjectgroup/v1.0.0",
      "group": "uniminds",
      "label": "Subjectgroup",
      "properties": [
        {
          "numOfOccurences": 307,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 307,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 307,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 307,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 283,
          "canBe": [
            "minds/core/specimengroup/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 23,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 24,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 24,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 307,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 307,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 307,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 10,
          "canBe": [
            "uniminds/options/agecategory/v1.0.0"
          ],
          "simpleAttributeName": "ageCategory",
          "attribute": "https://schema.hbp.eu/uniminds/ageCategory",
          "label": "Age category"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "ageRangeMax",
          "attribute": "https://schema.hbp.eu/uniminds/ageRangeMax",
          "label": "Age range max"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "ageRangeMin",
          "attribute": "https://schema.hbp.eu/uniminds/ageRangeMin",
          "label": "Age range min"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainStructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/options/cellulartarget/v1.0.0"
          ],
          "simpleAttributeName": "cellularTarget",
          "attribute": "https://schema.hbp.eu/uniminds/cellularTarget",
          "label": "Cellular target"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "uniminds/options/disability/v1.0.0"
          ],
          "simpleAttributeName": "disability",
          "attribute": "https://schema.hbp.eu/uniminds/disability",
          "label": "Disability"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/options/genotype/v1.0.0"
          ],
          "simpleAttributeName": "genotype",
          "attribute": "https://schema.hbp.eu/uniminds/genotype",
          "label": "Genotype"
        },
        {
          "numOfOccurences": 4,
          "canBe": [
            "uniminds/options/handedness/v1.0.0"
          ],
          "simpleAttributeName": "handedness",
          "attribute": "https://schema.hbp.eu/uniminds/handedness",
          "label": "Handedness"
        },
        {
          "numOfOccurences": 4,
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "simpleAttributeName": "method",
          "attribute": "https://schema.hbp.eu/uniminds/method",
          "label": "Method"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "numOfSubjects",
          "attribute": "https://schema.hbp.eu/uniminds/numOfSubjects",
          "label": "Num of subjects"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "publication",
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication"
        },
        {
          "numOfOccurences": 9,
          "canBe": [
            "uniminds/options/sex/v1.0.0"
          ],
          "simpleAttributeName": "sex",
          "attribute": "https://schema.hbp.eu/uniminds/sex",
          "label": "Sex"
        },
        {
          "numOfOccurences": 12,
          "canBe": [
            "uniminds/options/species/v1.0.0"
          ],
          "simpleAttributeName": "species",
          "attribute": "https://schema.hbp.eu/uniminds/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/options/strain/v1.0.0"
          ],
          "simpleAttributeName": "strain",
          "attribute": "https://schema.hbp.eu/uniminds/strain",
          "label": "Strain"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "numOfOccurences": 298,
          "canBe": [
            "uniminds/core/subject/v1.0.0"
          ],
          "simpleAttributeName": "subjects",
          "attribute": "https://schema.hbp.eu/uniminds/subjects",
          "label": "Subjects"
        },
        {
          "simplePropertyName": "subjectGroup",
          "canBe": [
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/file/v1.0.0",
            "uniminds/core/publication/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/subjectGroup",
          "label": "Subject group",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/simulation/emodel/v0.1.1",
      "group": "neuralactivity",
      "label": "Emodel",
      "properties": [
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 237,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 230,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "eModel",
          "canBe": [
            "neuralactivity/simulation/memodel/v0.1.2"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/eModel",
          "label": "E model",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/file/v0.0.4",
      "group": "minds",
      "label": "File",
      "properties": [
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "absolute_path",
          "attribute": "http://hbp.eu/minds#absolute_path",
          "label": "Absolute path"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "byte_size",
          "attribute": "http://hbp.eu/minds#byte_size",
          "label": "Byte size"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "content_type",
          "attribute": "http://hbp.eu/minds#content_type",
          "label": "Content type"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "hash",
          "attribute": "http://hbp.eu/minds#hash",
          "label": "Hash"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "last_modified",
          "attribute": "http://hbp.eu/minds#last_modified",
          "label": "Last modified"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "relative_path",
          "attribute": "http://hbp.eu/minds#relative_path",
          "label": "Relative path"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 968,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "file",
          "canBe": [
            "minds/core/fileassociation/v0.0.4"
          ],
          "attribute": "http://hbp.eu/minds#file",
          "label": "File",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/ethics/approval/v1.0.0",
      "group": "minds",
      "label": "Approval",
      "properties": [
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 26,
          "canBe": [
            "minds/ethics/authority/v1.0.0"
          ],
          "simpleAttributeName": "generatedBy",
          "attribute": "https://schema.hbp.eu/minds/generatedBy",
          "label": "Generated by"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "ethicsApproval",
          "canBe": [
            "minds/core/activity/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/ethicsApproval",
          "label": "Ethics approval",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/core/ethicsapproval/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/electrophysiology/trace/v0.1.0",
      "group": "neuralactivity",
      "label": "Trace",
      "properties": [
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "distribution",
          "attribute": "http://schema.org/distribution",
          "label": "Distribution"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 26,
          "canBe": [
            "neuralactivity/electrophysiology/tracegeneration/v0.1.0"
          ],
          "simpleAttributeName": "qualifiedGeneration",
          "attribute": "http://www.w3.org/ns/prov#qualifiedGeneration",
          "label": "Qualified generation"
        },
        {
          "numOfOccurences": 26,
          "canBe": [
            "neuralactivity/electrophysiology/stimulusexperiment/v0.1.0"
          ],
          "simpleAttributeName": "wasGeneratedBy",
          "attribute": "http://www.w3.org/ns/prov#wasGeneratedBy",
          "label": "Was generated by"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "channel",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/channel",
          "label": "Channel"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "dataUnit",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/dataUnit",
          "label": "Data unit"
        },
        {
          "numOfOccurences": 23,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "partOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/partOf",
          "label": "Part of"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "timeStep",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/timeStep",
          "label": "Time step"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "minds/core/dataset/v1.0.0",
      "group": "minds",
      "label": "Dataset",
      "properties": [
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 214,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 60,
          "simpleAttributeName": "container_url",
          "attribute": "http://schema.org/container_url",
          "label": "Container url"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "datalink",
          "attribute": "http://schema.org/datalink",
          "label": "Datalink"
        },
        {
          "numOfOccurences": 600,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 214,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 18,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "wasRevisionOf",
          "attribute": "http://www.w3.org/ns/prov#wasRevisionOf",
          "label": "Was revision of"
        },
        {
          "numOfOccurences": 590,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 601,
          "canBe": [
            "minds/core/activity/v1.0.0"
          ],
          "simpleAttributeName": "activity",
          "attribute": "https://schema.hbp.eu/minds/activity",
          "label": "Activity"
        },
        {
          "numOfOccurences": 588,
          "canBe": [
            "minds/core/placomponent/v1.0.0"
          ],
          "simpleAttributeName": "component",
          "attribute": "https://schema.hbp.eu/minds/component",
          "label": "Component"
        },
        {
          "numOfOccurences": 552,
          "simpleAttributeName": "container_url",
          "attribute": "https://schema.hbp.eu/minds/container_url",
          "label": "Container url"
        },
        {
          "numOfOccurences": 413,
          "simpleAttributeName": "containerUrlAsZIP",
          "attribute": "https://schema.hbp.eu/minds/containerUrlAsZIP",
          "label": "Container url as zip"
        },
        {
          "numOfOccurences": 602,
          "canBe": [
            "minds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "contributors",
          "attribute": "https://schema.hbp.eu/minds/contributors",
          "label": "Contributors"
        },
        {
          "numOfOccurences": 214,
          "simpleAttributeName": "created_at",
          "attribute": "https://schema.hbp.eu/minds/created_at",
          "label": "Created at"
        },
        {
          "numOfOccurences": 248,
          "simpleAttributeName": "datalink",
          "attribute": "https://schema.hbp.eu/minds/datalink",
          "label": "Datalink"
        },
        {
          "numOfOccurences": 214,
          "simpleAttributeName": "datasetDOI",
          "attribute": "https://schema.hbp.eu/minds/datasetDOI",
          "label": "Dataset doi"
        },
        {
          "numOfOccurences": 600,
          "canBe": [
            "minds/core/embargostatus/v1.0.0"
          ],
          "simpleAttributeName": "embargo_status",
          "attribute": "https://schema.hbp.eu/minds/embargo_status",
          "label": "Embargo status"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "external_datalink",
          "attribute": "https://schema.hbp.eu/minds/external_datalink",
          "label": "External datalink"
        },
        {
          "numOfOccurences": 584,
          "canBe": [
            "minds/core/format/v1.0.0"
          ],
          "simpleAttributeName": "formats",
          "attribute": "https://schema.hbp.eu/minds/formats",
          "label": "Formats"
        },
        {
          "numOfOccurences": 70,
          "canBe": [
            "minds/core/licensetype/v1.0.0"
          ],
          "simpleAttributeName": "license",
          "attribute": "https://schema.hbp.eu/minds/license",
          "label": "License"
        },
        {
          "numOfOccurences": 596,
          "canBe": [
            "licenses/core/information/v1.0.0"
          ],
          "simpleAttributeName": "license_info",
          "attribute": "https://schema.hbp.eu/minds/license_info",
          "label": "License info"
        },
        {
          "numOfOccurences": 89,
          "canBe": [
            "minds/core/modality/v1.0.0"
          ],
          "simpleAttributeName": "modality",
          "attribute": "https://schema.hbp.eu/minds/modality",
          "label": "Modality"
        },
        {
          "numOfOccurences": 601,
          "canBe": [
            "minds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "owners",
          "attribute": "https://schema.hbp.eu/minds/owners",
          "label": "Owners"
        },
        {
          "numOfOccurences": 368,
          "canBe": [
            "minds/core/parcellationatlas/v1.0.0"
          ],
          "simpleAttributeName": "parcellationAtlas",
          "attribute": "https://schema.hbp.eu/minds/parcellationAtlas",
          "label": "Parcellation atlas"
        },
        {
          "numOfOccurences": 589,
          "canBe": [
            "minds/core/parcellationregion/v1.0.0"
          ],
          "simpleAttributeName": "parcellationRegion",
          "attribute": "https://schema.hbp.eu/minds/parcellationRegion",
          "label": "Parcellation region"
        },
        {
          "numOfOccurences": 532,
          "canBe": [
            "minds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "publications",
          "attribute": "https://schema.hbp.eu/minds/publications",
          "label": "Publications"
        },
        {
          "numOfOccurences": 506,
          "canBe": [
            "minds/core/referencespace/v1.0.0"
          ],
          "simpleAttributeName": "reference_space",
          "attribute": "https://schema.hbp.eu/minds/reference_space",
          "label": "Reference space"
        },
        {
          "numOfOccurences": 214,
          "simpleAttributeName": "release_date",
          "attribute": "https://schema.hbp.eu/minds/release_date",
          "label": "Release date"
        },
        {
          "numOfOccurences": 596,
          "canBe": [
            "minds/core/specimengroup/v1.0.0"
          ],
          "simpleAttributeName": "specimen_group",
          "attribute": "https://schema.hbp.eu/minds/specimen_group",
          "label": "Specimen group"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "reference",
          "attribute": "https://schema.hbp.eu/neuroglancer/reference",
          "label": "Reference"
        },
        {
          "numOfOccurences": 374,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 374,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 609,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "wasRevisionOf",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasRevisionOf",
          "label": "Was revision of",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "hbpkg/core/invitation/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "v1.0.0",
          "canBe": [
            "cscs/core/file/v1.0.0"
          ],
          "attribute": "minds/core/fileassociation/v1.0.0",
          "label": "V 1 . 0 . 0",
          "reverse": true
        },
        {
          "simplePropertyName": "dataset",
          "canBe": [
            "neuroglancer/seeg/coordinate/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/seeg/dataset",
          "label": "Dataset",
          "reverse": true
        },
        {
          "simplePropertyName": "reference",
          "canBe": [
            "neuroglancer/viewer/neuroglancer/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/neuroglancer/reference",
          "label": "Reference",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "bookmarkInstanceLink",
          "canBe": [
            "hbpkg/core/bookmark/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkInstanceLink",
          "label": "Bookmark instance link",
          "reverse": true
        },
        {
          "simplePropertyName": "dataset",
          "canBe": [
            "brainviewer/viewer/link/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/brainviewer/dataset",
          "label": "Dataset",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        },
        {
          "simplePropertyName": "doireference",
          "canBe": [
            "datacite/core/doi/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/doireference",
          "label": "Doireference",
          "reverse": true
        },
        {
          "simplePropertyName": "partOf",
          "canBe": [
            "neuralactivity/electrophysiology/multitrace/v0.1.0",
            "neuralactivity/electrophysiology/trace/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/partOf",
          "label": "Part of",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/disability/v1.0.0",
      "group": "uniminds",
      "label": "Disability",
      "properties": [
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "disability",
          "canBe": [
            "uniminds/core/subjectgroup/v1.0.0",
            "uniminds/core/subject/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/disability",
          "label": "Disability",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/licensetype/v1.0.0",
      "group": "minds",
      "label": "Licensetype",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "license",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/license",
          "label": "License",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/genotype/v1.0.0",
      "group": "uniminds",
      "label": "Genotype",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "genotype",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/genotype",
          "label": "Genotype",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/filebundle/v1.0.0",
      "group": "uniminds",
      "label": "Filebundle",
      "properties": [
        {
          "numOfOccurences": 304,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 304,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 198,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 304,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 304,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "url",
          "attribute": "http://schema.org/url",
          "label": "Url"
        },
        {
          "numOfOccurences": 68,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 304,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 304,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 304,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 7,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainStructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "uniminds/options/cellulartarget/v1.0.0"
          ],
          "simpleAttributeName": "cellularTarget",
          "attribute": "https://schema.hbp.eu/uniminds/cellularTarget",
          "label": "Cellular target"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/core/file/v1.0.0"
          ],
          "simpleAttributeName": "file",
          "attribute": "https://schema.hbp.eu/uniminds/file",
          "label": "File"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/core/filebundle/v1.0.0"
          ],
          "simpleAttributeName": "fileBundle",
          "attribute": "https://schema.hbp.eu/uniminds/fileBundle",
          "label": "File bundle"
        },
        {
          "numOfOccurences": 7,
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "simpleAttributeName": "method",
          "attribute": "https://schema.hbp.eu/uniminds/method",
          "label": "Method"
        },
        {
          "numOfOccurences": 8,
          "canBe": [
            "uniminds/options/mimetype/v1.0.0"
          ],
          "simpleAttributeName": "mimeType",
          "attribute": "https://schema.hbp.eu/uniminds/mimeType",
          "label": "Mime type"
        },
        {
          "numOfOccurences": 277,
          "canBe": [
            "uniminds/core/modelinstance/v1.0.0"
          ],
          "simpleAttributeName": "modelInstance",
          "attribute": "https://schema.hbp.eu/uniminds/modelInstance",
          "label": "Model instance"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "publication",
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication"
        },
        {
          "numOfOccurences": 7,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "numOfOccurences": 4,
          "canBe": [
            "uniminds/core/subject/v1.0.0"
          ],
          "simpleAttributeName": "subject",
          "attribute": "https://schema.hbp.eu/uniminds/subject",
          "label": "Subject"
        },
        {
          "numOfOccurences": 10,
          "canBe": [
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "simpleAttributeName": "subjectGroup",
          "attribute": "https://schema.hbp.eu/uniminds/subjectGroup",
          "label": "Subject group"
        },
        {
          "numOfOccurences": 55,
          "simpleAttributeName": "usageNotes",
          "attribute": "https://schema.hbp.eu/uniminds/usageNotes",
          "label": "Usage notes"
        },
        {
          "simplePropertyName": "fileBundle",
          "canBe": [
            "uniminds/core/filebundle/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/fileBundle",
          "label": "File bundle",
          "reverse": true
        },
        {
          "simplePropertyName": "v1.0.0",
          "canBe": [
            "cscs/core/file/v1.0.0"
          ],
          "attribute": "uniminds/core/fileassociation/v1.0.0",
          "label": "V 1 . 0 . 0",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "mainFileBundle",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/mainFileBundle",
          "label": "Main file bundle",
          "reverse": true
        }
      ]
    },
    {
      "id": "hbpkg/core/user/v0.0.1",
      "group": "hbpkg",
      "label": "User",
      "properties": [
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "userId",
          "attribute": "https://schema.hbp.eu/hbpkg/userId",
          "label": "User id"
        },
        {
          "numOfOccurences": 58,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 45,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "user",
          "canBe": [
            "hbpkg/core/bookmarklistfolder/v0.0.1",
            "hbpkg/core/invitation/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/user",
          "label": "User",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/softwarefeaturecategory/v0.1.0",
      "group": "softwarecatalog",
      "label": "Softwarefeaturecategory",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "uniminds/core/subject/v1.0.0",
      "group": "uniminds",
      "label": "Subject",
      "properties": [
        {
          "numOfOccurences": 718,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 718,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 718,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 718,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 553,
          "canBe": [
            "minds/experiment/subject/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 165,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 165,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 165,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 718,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 718,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 718,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 548,
          "simpleAttributeName": "age",
          "attribute": "https://schema.hbp.eu/uniminds/age",
          "label": "Age"
        },
        {
          "numOfOccurences": 688,
          "canBe": [
            "uniminds/options/agecategory/v1.0.0"
          ],
          "simpleAttributeName": "ageCategory",
          "attribute": "https://schema.hbp.eu/uniminds/ageCategory",
          "label": "Age category"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "ageRangeMax",
          "attribute": "https://schema.hbp.eu/uniminds/ageRangeMax",
          "label": "Age range max"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "ageRangeMin",
          "attribute": "https://schema.hbp.eu/uniminds/ageRangeMin",
          "label": "Age range min"
        },
        {
          "numOfOccurences": 9,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainstructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainstructure",
          "label": "Brainstructure"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/options/cellulartarget/v1.0.0"
          ],
          "simpleAttributeName": "cellularTarget",
          "attribute": "https://schema.hbp.eu/uniminds/cellularTarget",
          "label": "Cellular target"
        },
        {
          "numOfOccurences": 27,
          "canBe": [
            "uniminds/options/disability/v1.0.0"
          ],
          "simpleAttributeName": "disability",
          "attribute": "https://schema.hbp.eu/uniminds/disability",
          "label": "Disability"
        },
        {
          "numOfOccurences": 22,
          "canBe": [
            "uniminds/options/genotype/v1.0.0"
          ],
          "simpleAttributeName": "genotype",
          "attribute": "https://schema.hbp.eu/uniminds/genotype",
          "label": "Genotype"
        },
        {
          "numOfOccurences": 103,
          "canBe": [
            "uniminds/options/handedness/v1.0.0"
          ],
          "simpleAttributeName": "handedness",
          "attribute": "https://schema.hbp.eu/uniminds/handedness",
          "label": "Handedness"
        },
        {
          "numOfOccurences": 51,
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "simpleAttributeName": "method",
          "attribute": "https://schema.hbp.eu/uniminds/method",
          "label": "Method"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "publication",
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication"
        },
        {
          "numOfOccurences": 686,
          "canBe": [
            "uniminds/options/sex/v1.0.0"
          ],
          "simpleAttributeName": "sex",
          "attribute": "https://schema.hbp.eu/uniminds/sex",
          "label": "Sex"
        },
        {
          "numOfOccurences": 690,
          "canBe": [
            "uniminds/options/species/v1.0.0"
          ],
          "simpleAttributeName": "species",
          "attribute": "https://schema.hbp.eu/uniminds/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 27,
          "canBe": [
            "uniminds/options/strain/v1.0.0"
          ],
          "simpleAttributeName": "strain",
          "attribute": "https://schema.hbp.eu/uniminds/strain",
          "label": "Strain"
        },
        {
          "numOfOccurences": 36,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "simplePropertyName": "subject",
          "canBe": [
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/file/v1.0.0",
            "uniminds/core/tissuesample/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/subject",
          "label": "Subject",
          "reverse": true
        },
        {
          "simplePropertyName": "subjects",
          "canBe": [
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/subjects",
          "label": "Subjects",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/dataset/v1.0.0",
      "group": "uniminds",
      "label": "Dataset",
      "properties": [
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 281,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 272,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 6,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainStructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "uniminds/options/cellulartarget/v1.0.0"
          ],
          "simpleAttributeName": "cellularTarget",
          "attribute": "https://schema.hbp.eu/uniminds/cellularTarget",
          "label": "Cellular target"
        },
        {
          "numOfOccurences": 279,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "contributor",
          "attribute": "https://schema.hbp.eu/uniminds/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 10,
          "canBe": [
            "uniminds/options/organization/v1.0.0"
          ],
          "simpleAttributeName": "createdAs",
          "attribute": "https://schema.hbp.eu/uniminds/createdAs",
          "label": "Created as"
        },
        {
          "numOfOccurences": 282,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "custodian",
          "attribute": "https://schema.hbp.eu/uniminds/custodian",
          "label": "Custodian"
        },
        {
          "numOfOccurences": 272,
          "canBe": [
            "uniminds/options/doi/v1.0.0"
          ],
          "simpleAttributeName": "doi",
          "attribute": "https://schema.hbp.eu/uniminds/doi",
          "label": "Doi"
        },
        {
          "numOfOccurences": 281,
          "canBe": [
            "uniminds/options/embargostatus/v1.0.0"
          ],
          "simpleAttributeName": "embargoStatus",
          "attribute": "https://schema.hbp.eu/uniminds/embargoStatus",
          "label": "Embargo status"
        },
        {
          "numOfOccurences": 275,
          "canBe": [
            "uniminds/core/ethicsapproval/v1.0.0"
          ],
          "simpleAttributeName": "ethicsApproval",
          "attribute": "https://schema.hbp.eu/uniminds/ethicsApproval",
          "label": "Ethics approval"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "fundedBy",
          "attribute": "https://schema.hbp.eu/uniminds/fundedBy",
          "label": "Funded by"
        },
        {
          "numOfOccurences": 8,
          "canBe": [
            "uniminds/core/fundinginformation/v1.0.0"
          ],
          "simpleAttributeName": "fundingInformation",
          "attribute": "https://schema.hbp.eu/uniminds/fundingInformation",
          "label": "Funding information"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/hbpcomponent/v1.0.0"
          ],
          "simpleAttributeName": "hbpComponent",
          "attribute": "https://schema.hbp.eu/uniminds/hbpComponent",
          "label": "Hbp component"
        },
        {
          "numOfOccurences": 219,
          "simpleAttributeName": "intendedReleaseDate",
          "attribute": "https://schema.hbp.eu/uniminds/intendedReleaseDate",
          "label": "Intended release date"
        },
        {
          "numOfOccurences": 280,
          "canBe": [
            "uniminds/options/license/v1.0.0"
          ],
          "simpleAttributeName": "license",
          "attribute": "https://schema.hbp.eu/uniminds/license",
          "label": "License"
        },
        {
          "numOfOccurences": 280,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "mainContact",
          "attribute": "https://schema.hbp.eu/uniminds/mainContact",
          "label": "Main contact"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "uniminds/core/filebundle/v1.0.0"
          ],
          "simpleAttributeName": "mainFileBundle",
          "attribute": "https://schema.hbp.eu/uniminds/mainFileBundle",
          "label": "Main file bundle"
        },
        {
          "numOfOccurences": 7,
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "simpleAttributeName": "method",
          "attribute": "https://schema.hbp.eu/uniminds/method",
          "label": "Method"
        },
        {
          "numOfOccurences": 9,
          "canBe": [
            "uniminds/core/project/v1.0.0"
          ],
          "simpleAttributeName": "project",
          "attribute": "https://schema.hbp.eu/uniminds/project",
          "label": "Project"
        },
        {
          "numOfOccurences": 274,
          "canBe": [
            "uniminds/options/publicationid/v1.0.0",
            "uniminds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "publication",
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication"
        },
        {
          "numOfOccurences": 9,
          "canBe": [
            "uniminds/options/species/v1.0.0"
          ],
          "simpleAttributeName": "species",
          "attribute": "https://schema.hbp.eu/uniminds/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 4,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "numOfOccurences": 282,
          "canBe": [
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "simpleAttributeName": "subjectGroup",
          "attribute": "https://schema.hbp.eu/uniminds/subjectGroup",
          "label": "Subject group"
        },
        {
          "simplePropertyName": "bookmarkInstanceLink",
          "canBe": [
            "hbpkg/core/bookmark/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkInstanceLink",
          "label": "Bookmark instance link",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/method/v1.0.0",
      "group": "uniminds",
      "label": "Method",
      "properties": [
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 15,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainStructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure"
        },
        {
          "numOfOccurences": 10,
          "canBe": [
            "uniminds/core/ethicsapproval/v1.0.0"
          ],
          "simpleAttributeName": "ethicsApproval",
          "attribute": "https://schema.hbp.eu/uniminds/ethicsApproval",
          "label": "Ethics approval"
        },
        {
          "numOfOccurences": 26,
          "canBe": [
            "uniminds/options/experimentalpreparation/v1.0.0"
          ],
          "simpleAttributeName": "experimentalPreparation",
          "attribute": "https://schema.hbp.eu/uniminds/experimentalPreparation",
          "label": "Experimental preparation"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "fullName",
          "attribute": "https://schema.hbp.eu/uniminds/fullName",
          "label": "Full name"
        },
        {
          "numOfOccurences": 35,
          "canBe": [
            "uniminds/options/methodcategory/v1.0.0"
          ],
          "simpleAttributeName": "methodCategory",
          "attribute": "https://schema.hbp.eu/uniminds/methodCategory",
          "label": "Method category"
        },
        {
          "numOfOccurences": 13,
          "canBe": [
            "uniminds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "publication",
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication"
        },
        {
          "numOfOccurences": 21,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "simpleAttributeName": "subMethod",
          "attribute": "https://schema.hbp.eu/uniminds/subMethod",
          "label": "Sub method"
        },
        {
          "simplePropertyName": "method",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0",
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/file/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/method",
          "label": "Method",
          "reverse": true
        },
        {
          "simplePropertyName": "subMethod",
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/subMethod",
          "label": "Sub method",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/agecategory/v1.0.0",
      "group": "minds",
      "label": "Agecategory",
      "properties": [
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "age_category",
          "canBe": [
            "minds/experiment/subject/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/age_category",
          "label": "Age category",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/options/agecategory/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "hbppreview/core/filepreview/v1.0.0",
      "group": "hbppreview",
      "label": "Filepreview",
      "properties": [
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "isPreviewAnimated",
          "attribute": "https://schema.hbp.eu/file/isPreviewAnimated",
          "label": "Is preview animated"
        },
        {
          "numOfOccurences": 13650,
          "canBe": [
            "cscs/core/file/v1.0.0"
          ],
          "simpleAttributeName": "previewFileRef",
          "attribute": "https://schema.hbp.eu/file/previewFileRef",
          "label": "Preview file ref"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "previewUrl",
          "attribute": "https://schema.hbp.eu/file/previewUrl",
          "label": "Preview url"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "staticImageUrl",
          "attribute": "https://schema.hbp.eu/file/staticImageUrl",
          "label": "Static image url"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "thumbnailUrl",
          "attribute": "https://schema.hbp.eu/file/thumbnailUrl",
          "label": "Thumbnail url"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 13650,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/modality/v1.0.0",
      "group": "minds",
      "label": "Modality",
      "properties": [
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "modality",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/modality",
          "label": "Modality",
          "reverse": true
        }
      ]
    },
    {
      "id": "test/spatial/anchoring/v0.0.1",
      "group": "test",
      "label": "Anchoring",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "coordinates",
          "attribute": "https://schema.hbp.eu/spatialanchoring/coordinates",
          "label": "Coordinates"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "test/core/test/v0.0.1"
          ],
          "simpleAttributeName": "locatedInstance",
          "attribute": "https://schema.hbp.eu/spatialanchoring/locatedInstance",
          "label": "Located instance"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "referenceSpace",
          "attribute": "https://schema.hbp.eu/spatialanchoring/referenceSpace",
          "label": "Reference space"
        }
      ]
    },
    {
      "id": "minds/core/species/v1.0.0",
      "group": "minds",
      "label": "Species",
      "properties": [
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "ontologies/core/organism/v1.0.0"
          ],
          "simpleAttributeName": "alternateOf",
          "attribute": "http://www.w3.org/ns/prov#alternateOf",
          "label": "Alternate of"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/options/species/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        },
        {
          "simplePropertyName": "species",
          "canBe": [
            "minds/experiment/subject/v1.0.0",
            "minds/core/parcellationregion/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/species",
          "label": "Species",
          "reverse": true
        }
      ]
    },
    {
      "id": "test/spatial/anchoring/v0.0.2",
      "group": "test",
      "label": "Anchoring",
      "properties": [
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "foo",
          "attribute": "https://schema.hbp.eu/foo",
          "label": "Foo"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "coordinates",
          "attribute": "https://schema.hbp.eu/spatialanchoring/coordinates",
          "label": "Coordinates"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "format",
          "attribute": "https://schema.hbp.eu/spatialanchoring/format",
          "label": "Format"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "locatedInstance",
          "attribute": "https://schema.hbp.eu/spatialanchoring/locatedInstance",
          "label": "Located instance"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "referenceSpace",
          "attribute": "https://schema.hbp.eu/spatialanchoring/referenceSpace",
          "label": "Reference space"
        }
      ]
    },
    {
      "id": "datacite/prov/release/v0.0.1",
      "group": "datacite",
      "label": "Release",
      "properties": [
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 171,
          "canBe": [
            "datacite/core/doi/v0.0.1"
          ],
          "simpleAttributeName": "releaseinstance",
          "attribute": "http://hbp.eu/minds#releaseinstance",
          "label": "Releaseinstance"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "releasestate",
          "attribute": "http://hbp.eu/minds#releasestate",
          "label": "Releasestate"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "minds/experiment/subject/v1.0.0",
      "group": "minds",
      "label": "Subject",
      "properties": [
        {
          "numOfOccurences": 946,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 946,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 538,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 946,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 946,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 538,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 465,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 774,
          "simpleAttributeName": "age",
          "attribute": "https://schema.hbp.eu/minds/age",
          "label": "Age"
        },
        {
          "numOfOccurences": 891,
          "canBe": [
            "minds/core/agecategory/v1.0.0"
          ],
          "simpleAttributeName": "age_category",
          "attribute": "https://schema.hbp.eu/minds/age_category",
          "label": "Age category"
        },
        {
          "numOfOccurences": 188,
          "simpleAttributeName": "causeOfDeath",
          "attribute": "https://schema.hbp.eu/minds/causeOfDeath",
          "label": "Cause of death"
        },
        {
          "numOfOccurences": 270,
          "simpleAttributeName": "genotype",
          "attribute": "https://schema.hbp.eu/minds/genotype",
          "label": "Genotype"
        },
        {
          "numOfOccurences": 793,
          "canBe": [
            "minds/experiment/sample/v1.0.0"
          ],
          "simpleAttributeName": "samples",
          "attribute": "https://schema.hbp.eu/minds/samples",
          "label": "Samples"
        },
        {
          "numOfOccurences": 935,
          "canBe": [
            "minds/core/sex/v1.0.0"
          ],
          "simpleAttributeName": "sex",
          "attribute": "https://schema.hbp.eu/minds/sex",
          "label": "Sex"
        },
        {
          "numOfOccurences": 939,
          "canBe": [
            "minds/core/species/v1.0.0"
          ],
          "simpleAttributeName": "species",
          "attribute": "https://schema.hbp.eu/minds/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 295,
          "simpleAttributeName": "strain",
          "attribute": "https://schema.hbp.eu/minds/strain",
          "label": "Strain"
        },
        {
          "numOfOccurences": 538,
          "simpleAttributeName": "strains",
          "attribute": "https://schema.hbp.eu/minds/strains",
          "label": "Strains"
        },
        {
          "numOfOccurences": 197,
          "simpleAttributeName": "weight",
          "attribute": "https://schema.hbp.eu/minds/weight",
          "label": "Weight"
        },
        {
          "numOfOccurences": 391,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 391,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 946,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 946,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 946,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/core/subject/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        },
        {
          "simplePropertyName": "subjects",
          "canBe": [
            "minds/core/specimengroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/subjects",
          "label": "Subjects",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/fileassociation/v1.0.0",
      "group": "uniminds",
      "label": "Fileassociation",
      "properties": [
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "from",
          "attribute": "https://schema.hbp.eu/linkinginstance/from",
          "label": "From"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "to",
          "attribute": "https://schema.hbp.eu/linkinginstance/to",
          "label": "To"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 12171,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "minds/core/parcellationatlas/v1.0.0",
      "group": "minds",
      "label": "Parcellationatlas",
      "properties": [
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "parcellationAtlas",
          "canBe": [
            "minds/experiment/sample/v1.0.0",
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/parcellationAtlas",
          "label": "Parcellation atlas",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/doi/v1.0.0",
      "group": "uniminds",
      "label": "Doi",
      "properties": [
        {
          "numOfOccurences": 177,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 177,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 177,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 177,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 177,
          "canBe": [
            "datacite/core/doi/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 177,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 177,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 177,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "citation",
          "attribute": "https://schema.hbp.eu/uniminds/citation",
          "label": "Citation"
        },
        {
          "simplePropertyName": "doi",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/doi",
          "label": "Doi",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/cellulartarget/v1.0.0",
      "group": "uniminds",
      "label": "Cellulartarget",
      "properties": [
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "cellularTarget",
          "canBe": [
            "uniminds/core/modelinstance/v1.0.0",
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/cellularTarget",
          "label": "Cellular target",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/electrophysiology/multitracegeneration/v0.1.0",
      "group": "neuralactivity",
      "label": "Multitracegeneration",
      "properties": [
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 49,
          "canBe": [
            "neuralactivity/electrophysiology/stimulusexperiment/v0.1.0"
          ],
          "simpleAttributeName": "activity",
          "attribute": "http://www.w3.org/ns/prov#activity",
          "label": "Activity"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "sweep",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/sweep",
          "label": "Sweep"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "qualifiedGeneration",
          "canBe": [
            "neuralactivity/electrophysiology/multitrace/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#qualifiedGeneration",
          "label": "Qualified generation",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/tissuesample/v1.0.0",
      "group": "uniminds",
      "label": "Tissuesample",
      "properties": [
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/subject/v1.0.0"
          ],
          "simpleAttributeName": "subject",
          "attribute": "https://schema.hbp.eu/uniminds/subject",
          "label": "Subject"
        }
      ]
    },
    {
      "id": "uniminds/options/filebundlegroup/v1.0.0",
      "group": "uniminds",
      "label": "Filebundlegroup",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "neuralactivity/simulation/modelinstance/v0.1.1",
      "group": "neuralactivity",
      "label": "Modelinstance",
      "properties": [
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "version",
          "attribute": "http://schema.org/version",
          "label": "Version"
        },
        {
          "numOfOccurences": 133,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 148,
          "canBe": [
            "neuralactivity/simulation/emodelscript/v0.1.0"
          ],
          "simpleAttributeName": "mainModelScript",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/mainModelScript",
          "label": "Main model script"
        },
        {
          "numOfOccurences": 63,
          "simpleAttributeName": "parameters",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/parameters",
          "label": "Parameters"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 118,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "generatedAtTime",
          "attribute": "https://schema.hbp.eu/neuralactivity/simulation/modelinstance/v0.1.1/generatedAtTime",
          "label": "Generated at time"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 148,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "hasPart",
          "canBe": [
            "neuralactivity/simulation/modelproject/v0.1.0"
          ],
          "attribute": "http://purl.org/dc/terms/hasPart",
          "label": "Has part",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/ethics/authority/v1.0.0",
      "group": "minds",
      "label": "Authority",
      "properties": [
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 19,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "ethicsAuthority",
          "canBe": [
            "minds/core/activity/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/ethicsAuthority",
          "label": "Ethics authority",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/options/ethicsauthority/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        },
        {
          "simplePropertyName": "generatedBy",
          "canBe": [
            "minds/ethics/approval/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/generatedBy",
          "label": "Generated by",
          "reverse": true
        }
      ]
    },
    {
      "id": "meta/minds/specification/v0.0.1",
      "group": "meta",
      "label": "Specification",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "meta/minds/specificationfield/v0.0.1"
          ],
          "simpleAttributeName": "fields",
          "attribute": "https://schema.hbp.eu/meta/editor/fields",
          "label": "Fields"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "folderID",
          "attribute": "https://schema.hbp.eu/meta/editor/folderID",
          "label": "Folder id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "folderName",
          "attribute": "https://schema.hbp.eu/meta/editor/folderName",
          "label": "Folder name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "identifier",
          "attribute": "https://schema.hbp.eu/meta/editor/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "label",
          "attribute": "https://schema.hbp.eu/meta/editor/label",
          "label": "Label"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "refreshSpecification",
          "attribute": "https://schema.hbp.eu/meta/editor/refreshSpecification",
          "label": "Refresh specification"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "targetType",
          "attribute": "https://schema.hbp.eu/meta/editor/targetType",
          "label": "Target type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "licenses/core/information/v1.0.0",
      "group": "licenses",
      "label": "Information",
      "properties": [
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "alternateName",
          "attribute": "http://schema.org/alternateName",
          "label": "Alternate name"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "url",
          "attribute": "http://schema.org/url",
          "label": "Url"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "license_info",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/license_info",
          "label": "License info",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/experiment/brainslicing/v0.1.0",
      "group": "neuralactivity",
      "label": "Brainslicing",
      "properties": [
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 44,
          "canBe": [
            "neuralactivity/core/slice/v0.1.0"
          ],
          "simpleAttributeName": "generated",
          "attribute": "http://www.w3.org/ns/prov#generated",
          "label": "Generated"
        },
        {
          "numOfOccurences": 44,
          "canBe": [
            "neuralactivity/core/subject/v0.1.2",
            "neuralactivity/core/subject/v0.1.0"
          ],
          "simpleAttributeName": "used",
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "brainLocation",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainLocation",
          "label": "Brain location"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "cuttingThickness",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/cuttingThickness",
          "label": "Cutting thickness"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "slicingPlane",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/slicingPlane",
          "label": "Slicing plane"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "solution",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/solution",
          "label": "Solution"
        },
        {
          "numOfOccurences": 42,
          "canBe": [
            "neuralactivity/core/person/v0.1.0"
          ],
          "simpleAttributeName": "wasAssociatedWith",
          "attribute": "https://schema.hbp.eu/neuralactivity/experiment/brainslicing/v0.1.0/wasAssociatedWith",
          "label": "Was associated with"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "uniminds/options/sex/v1.0.0",
      "group": "uniminds",
      "label": "Sex",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "minds/core/sex/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "sex",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/sex",
          "label": "Sex",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/person/v1.0.0",
      "group": "uniminds",
      "label": "Person",
      "properties": [
        {
          "numOfOccurences": 594,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 594,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "email",
          "attribute": "http://schema.org/email",
          "label": "Email"
        },
        {
          "numOfOccurences": 586,
          "simpleAttributeName": "familyName",
          "attribute": "http://schema.org/familyName",
          "label": "Family name"
        },
        {
          "numOfOccurences": 581,
          "simpleAttributeName": "givenName",
          "attribute": "http://schema.org/givenName",
          "label": "Given name"
        },
        {
          "numOfOccurences": 594,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 593,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 388,
          "canBe": [
            "minds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 36,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 35,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 35,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 594,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 594,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 594,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "orcid",
          "attribute": "https://schema.hbp.eu/uniminds/orcid",
          "label": "Orcid"
        },
        {
          "simplePropertyName": "custodian",
          "canBe": [
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/modelinstance/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/custodian",
          "label": "Custodian",
          "reverse": true
        },
        {
          "simplePropertyName": "componentOwner",
          "canBe": [
            "uniminds/core/hbpcomponent/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/componentOwner",
          "label": "Component owner",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "mainContact",
          "canBe": [
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/modelinstance/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/mainContact",
          "label": "Main contact",
          "reverse": true
        },
        {
          "simplePropertyName": "contributor",
          "canBe": [
            "uniminds/core/modelinstance/v1.0.0",
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/contributor",
          "label": "Contributor",
          "reverse": true
        },
        {
          "simplePropertyName": "coordinator",
          "canBe": [
            "uniminds/core/project/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/coordinator",
          "label": "Coordinator",
          "reverse": true
        }
      ]
    },
    {
      "id": "fenix/core/file/v0.0.1",
      "group": "fenix",
      "label": "File",
      "properties": [
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "affiliation",
          "attribute": "https://schema.hbp.eu/fenix/affiliation",
          "label": "Affiliation"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "fenix/core/file/v0.0.1"
          ],
          "simpleAttributeName": "author",
          "attribute": "https://schema.hbp.eu/fenix/author",
          "label": "Author"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "fenix/core/file/v0.0.1"
          ],
          "simpleAttributeName": "contact",
          "attribute": "https://schema.hbp.eu/fenix/contact",
          "label": "Contact"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "container",
          "attribute": "https://schema.hbp.eu/fenix/container",
          "label": "Container"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "container_name",
          "attribute": "https://schema.hbp.eu/fenix/container_name",
          "label": "Container name"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "creation_date",
          "attribute": "https://schema.hbp.eu/fenix/creation_date",
          "label": "Creation date"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "description",
          "attribute": "https://schema.hbp.eu/fenix/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "endpoint",
          "attribute": "https://schema.hbp.eu/fenix/endpoint",
          "label": "Endpoint"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "fileType",
          "attribute": "https://schema.hbp.eu/fenix/fileType",
          "label": "File type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "mail",
          "attribute": "https://schema.hbp.eu/fenix/mail",
          "label": "Mail"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "owner",
          "attribute": "https://schema.hbp.eu/fenix/owner",
          "label": "Owner"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "owner_groups",
          "attribute": "https://schema.hbp.eu/fenix/owner_groups",
          "label": "Owner groups"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "resource_path",
          "attribute": "https://schema.hbp.eu/fenix/resource_path",
          "label": "Resource path"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "size",
          "attribute": "https://schema.hbp.eu/fenix/size",
          "label": "Size"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "storage",
          "attribute": "https://schema.hbp.eu/fenix/storage",
          "label": "Storage"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "tags",
          "attribute": "https://schema.hbp.eu/fenix/tags",
          "label": "Tags"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "contact",
          "canBe": [
            "fenix/core/file/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/fenix/contact",
          "label": "Contact",
          "reverse": true
        },
        {
          "simplePropertyName": "author",
          "canBe": [
            "fenix/core/file/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/fenix/author",
          "label": "Author",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/gproteincoupledreceptor/v1.0.0",
      "group": "ontologies",
      "label": "Gproteincoupledreceptor",
      "properties": [
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 117,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 1117,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 832,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 1117,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 175,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 53,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 117,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 117,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 1117,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 135,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 1233,
          "canBe": [
            "ontologies/core/gproteincoupledreceptor/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 272,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1234,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/gproteincoupledreceptor/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuroglancer/seeg/coordinate/v1.0.0",
      "group": "neuroglancer",
      "label": "Coordinate",
      "properties": [
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "coordinates",
          "attribute": "https://schema.hbp.eu/seeg/coordinates",
          "label": "Coordinates"
        },
        {
          "numOfOccurences": 51,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "dataset",
          "attribute": "https://schema.hbp.eu/seeg/dataset",
          "label": "Dataset"
        },
        {
          "numOfOccurences": 51,
          "simpleAttributeName": "referenceSpace",
          "attribute": "https://schema.hbp.eu/seeg/referenceSpace",
          "label": "Reference space"
        }
      ]
    },
    {
      "id": "minds/core/specimengroup/v1.0.0",
      "group": "minds",
      "label": "Specimengroup",
      "properties": [
        {
          "numOfOccurences": 407,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 407,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 270,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 407,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 407,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 270,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 141,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 270,
          "simpleAttributeName": "created_at",
          "attribute": "https://schema.hbp.eu/minds/created_at",
          "label": "Created at"
        },
        {
          "numOfOccurences": 398,
          "canBe": [
            "minds/experiment/subject/v1.0.0"
          ],
          "simpleAttributeName": "subjects",
          "attribute": "https://schema.hbp.eu/minds/subjects",
          "label": "Subjects"
        },
        {
          "numOfOccurences": 126,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 126,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 407,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 407,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 407,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "specimen_group",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/specimen_group",
          "label": "Specimen group",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "test/core/test/v0.0.1",
      "group": "test",
      "label": "Test",
      "properties": [
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "locatedInstance",
          "canBe": [
            "test/spatial/anchoring/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/spatialanchoring/locatedInstance",
          "label": "Located instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "unimindsimportscripts/core/filebundle/v1.0.0",
      "group": "unimindsimportscripts",
      "label": "Filebundle",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "knownContainers",
          "attribute": "https://schema.hbp.eu/import/knownContainers",
          "label": "Known containers"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "uniminds/options/brainstructure/v1.0.0",
      "group": "uniminds",
      "label": "Brainstructure",
      "properties": [
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "brainStructure",
          "canBe": [
            "uniminds/core/modelinstance/v1.0.0",
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0",
            "uniminds/core/file/v1.0.0",
            "uniminds/core/method/v1.0.0",
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/publication/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "brainstructure",
          "canBe": [
            "uniminds/core/subject/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/brainstructure",
          "label": "Brainstructure",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/neurotransmitter/v1.0.0",
      "group": "ontologies",
      "label": "Neurotransmitter",
      "properties": [
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "charge",
          "attribute": "http://purl.obolibrary.org/obo/chebi/charge",
          "label": "Charge"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "formula",
          "attribute": "http://purl.obolibrary.org/obo/chebi/formula",
          "label": "Formula"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "inchi",
          "attribute": "http://purl.obolibrary.org/obo/chebi/inchi",
          "label": "Inchi"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "inchikey",
          "attribute": "http://purl.obolibrary.org/obo/chebi/inchikey",
          "label": "Inchikey"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "mass",
          "attribute": "http://purl.obolibrary.org/obo/chebi/mass",
          "label": "Mass"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "monoisotopicmass",
          "attribute": "http://purl.obolibrary.org/obo/chebi/monoisotopicmass",
          "label": "Monoisotopicmass"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "smiles",
          "attribute": "http://purl.obolibrary.org/obo/chebi/smiles",
          "label": "Smiles"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "acronym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "hasCurationStatus",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/hasCurationStatus",
          "label": "Has curation status"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "sao_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/sao_ID",
          "label": "Sao id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "umls_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/umls_ID",
          "label": "Umls id"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "acronym",
          "attribute": "https://schema.hbp.eu/ontologies/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 24,
          "canBe": [
            "ontologies/core/neurotransmitter/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 20,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/neurotransmitter/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/experiment/patchedcellcollection/v0.1.0",
      "group": "neuralactivity",
      "label": "Patchedcellcollection",
      "properties": [
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 75,
          "canBe": [
            "neuralactivity/experiment/patchedcell/v0.1.0"
          ],
          "simpleAttributeName": "hadMember",
          "attribute": "http://www.w3.org/ns/prov#hadMember",
          "label": "Had member"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "hasPart",
          "canBe": [
            "neuralactivity/experiment/patchedslice/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/hasPart",
          "label": "Has part",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/softwarefeature/v0.1.0",
      "group": "softwarecatalog",
      "label": "Softwarefeature",
      "properties": [
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "feature",
          "attribute": "http://schema.org/feature",
          "label": "Feature"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "feature",
          "canBe": [
            "softwarecatalog/software/softwarefeaturesubcategory/v0.1.0"
          ],
          "attribute": "http://schema.org/feature",
          "label": "Feature",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/simulation/memodel/v0.1.2",
      "group": "neuralactivity",
      "label": "Memodel",
      "properties": [
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 88,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "version",
          "attribute": "http://schema.org/version",
          "label": "Version"
        },
        {
          "numOfOccurences": 237,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 239,
          "canBe": [
            "neuralactivity/simulation/emodel/v0.1.1"
          ],
          "simpleAttributeName": "eModel",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/eModel",
          "label": "E model"
        },
        {
          "numOfOccurences": 239,
          "canBe": [
            "neuralactivity/simulation/emodelscript/v0.1.0"
          ],
          "simpleAttributeName": "mainModelScript",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/mainModelScript",
          "label": "Main model script"
        },
        {
          "numOfOccurences": 224,
          "simpleAttributeName": "modelOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/modelOf",
          "label": "Model of"
        },
        {
          "numOfOccurences": 239,
          "canBe": [
            "neuralactivity/simulation/morphology/v0.1.1"
          ],
          "simpleAttributeName": "morphology",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/morphology",
          "label": "Morphology"
        },
        {
          "numOfOccurences": 117,
          "simpleAttributeName": "parameters",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/parameters",
          "label": "Parameters"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 230,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "generatedAtTime",
          "attribute": "https://schema.hbp.eu/neuralactivity/simulation/memodel/v0.1.2/generatedAtTime",
          "label": "Generated at time"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "hasPart",
          "canBe": [
            "neuralactivity/simulation/modelproject/v0.1.0"
          ],
          "attribute": "http://purl.org/dc/terms/hasPart",
          "label": "Has part",
          "reverse": true
        }
      ]
    },
    {
      "id": "demo/options/species/v1.0.0",
      "group": "demo",
      "label": "Species",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "species",
          "canBe": [
            "demo/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/demo/species",
          "label": "Species",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/brain/v1.0.0",
      "group": "ontologies",
      "label": "Brain",
      "properties": [
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 20,
          "simpleAttributeName": "provenance_notes",
          "attribute": "http://purl.obolibrary.org/obo/core#provenance_notes",
          "label": "Provenance notes"
        },
        {
          "numOfOccurences": 337,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 42,
          "simpleAttributeName": "IAO_0000116",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000116",
          "label": "Iao 0000116"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "IAO_0000232",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000232",
          "label": "Iao 0000232"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "EXACT_PREFERRED",
          "attribute": "http://purl.obolibrary.org/obo/uberon/core#EXACT_PREFERRED",
          "label": "Exact preferred"
        },
        {
          "numOfOccurences": 64,
          "simpleAttributeName": "UBPROP_0000001",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000001",
          "label": "Ubprop 0000001"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "UBPROP_0000002",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000002",
          "label": "Ubprop 0000002"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "UBPROP_0000003",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000003",
          "label": "Ubprop 0000003"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "UBPROP_0000007",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000007",
          "label": "Ubprop 0000007"
        },
        {
          "numOfOccurences": 27,
          "simpleAttributeName": "UBPROP_0000008",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000008",
          "label": "Ubprop 0000008"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "UBPROP_0000009",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000009",
          "label": "Ubprop 0000009"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "UBPROP_0000010",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000010",
          "label": "Ubprop 0000010"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "UBPROP_0000011",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000011",
          "label": "Ubprop 0000011"
        },
        {
          "numOfOccurences": 46,
          "simpleAttributeName": "UBPROP_0000012",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000012",
          "label": "Ubprop 0000012"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "UBPROP_0000013",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000013",
          "label": "Ubprop 0000013"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "UBPROP_0000015",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000015",
          "label": "Ubprop 0000015"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "consider",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#consider",
          "label": "Consider"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "created_by",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#created_by",
          "label": "Created by"
        },
        {
          "numOfOccurences": 20,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 133,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 416,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 385,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "hasNarrowSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym",
          "label": "Has narrow synonym"
        },
        {
          "numOfOccurences": 453,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 346,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 434,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 453,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 337,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 188,
          "canBe": [
            "ontologies/core/brain/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 425,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 455,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/brain/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/mimetype/v1.0.0",
      "group": "uniminds",
      "label": "Mimetype",
      "properties": [
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "mimeType",
          "canBe": [
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/file/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/mimeType",
          "label": "Mime type",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuroglancer/viewer/neuroglancer/v1.0.0",
      "group": "neuroglancer",
      "label": "Neuroglancer",
      "properties": [
        {
          "numOfOccurences": 660,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 660,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 660,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 584,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 557,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 660,
          "simpleAttributeName": "postfix",
          "attribute": "https://schema.hbp.eu/neuroglancer/postfix",
          "label": "Postfix"
        },
        {
          "numOfOccurences": 660,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "reference",
          "attribute": "https://schema.hbp.eu/neuroglancer/reference",
          "label": "Reference"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 660,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 660,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 660,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/simulation/morphology/v0.1.1",
      "group": "neuralactivity",
      "label": "Morphology",
      "properties": [
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 61,
          "simpleAttributeName": "distribution",
          "attribute": "http://schema.org/distribution",
          "label": "Distribution"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 224,
          "simpleAttributeName": "modelOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/modelOf",
          "label": "Model of"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 239,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "morphology",
          "canBe": [
            "neuralactivity/simulation/memodel/v0.1.2"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/morphology",
          "label": "Morphology",
          "reverse": true
        }
      ]
    },
    {
      "id": "meta/minds/specificationfield/v0.0.1",
      "group": "meta",
      "label": "Specificationfield",
      "properties": [
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "allowCustomValues",
          "attribute": "https://schema.hbp.eu/meta/editor/allowCustomValues",
          "label": "Allow custom values"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "closeDropdownAfterInteraction",
          "attribute": "https://schema.hbp.eu/meta/editor/closeDropdownAfterInteraction",
          "label": "Close dropdown after interaction"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "identifier",
          "attribute": "https://schema.hbp.eu/meta/editor/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "instancesPath",
          "attribute": "https://schema.hbp.eu/meta/editor/instancesPath",
          "label": "Instances path"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "isLink",
          "attribute": "https://schema.hbp.eu/meta/editor/isLink",
          "label": "Is link"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "key",
          "attribute": "https://schema.hbp.eu/meta/editor/key",
          "label": "Key"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "label",
          "attribute": "https://schema.hbp.eu/meta/editor/label",
          "label": "Label"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "mappingLabel",
          "attribute": "https://schema.hbp.eu/meta/editor/mappingLabel",
          "label": "Mapping label"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "mappingValue",
          "attribute": "https://schema.hbp.eu/meta/editor/mappingValue",
          "label": "Mapping value"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "type",
          "attribute": "https://schema.hbp.eu/meta/editor/type",
          "label": "Type"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "fields",
          "canBe": [
            "meta/minds/specification/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/meta/editor/fields",
          "label": "Fields",
          "reverse": true
        }
      ]
    },
    {
      "id": "cscs/core/file/v1.0.0",
      "group": "cscs",
      "label": "File",
      "properties": [
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 63,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "absolute_path",
          "attribute": "https://schema.hbp.eu/cscs/absolute_path",
          "label": "Absolute path"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "byte_size",
          "attribute": "https://schema.hbp.eu/cscs/byte_size",
          "label": "Byte size"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "content_type",
          "attribute": "https://schema.hbp.eu/cscs/content_type",
          "label": "Content type"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "hash",
          "attribute": "https://schema.hbp.eu/cscs/hash",
          "label": "Hash"
        },
        {
          "numOfOccurences": 43068,
          "simpleAttributeName": "human_readable_size",
          "attribute": "https://schema.hbp.eu/cscs/human_readable_size",
          "label": "Human readable size"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "last_modified",
          "attribute": "https://schema.hbp.eu/cscs/last_modified",
          "label": "Last modified"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "relative_path",
          "attribute": "https://schema.hbp.eu/cscs/relative_path",
          "label": "Relative path"
        },
        {
          "numOfOccurences": 43068,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 43131,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "previewFileRef",
          "canBe": [
            "hbppreview/core/filepreview/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/file/previewFileRef",
          "label": "Preview file ref",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/electrophysiology/multitrace/v0.1.0",
      "group": "neuralactivity",
      "label": "Multitrace",
      "properties": [
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "distribution",
          "attribute": "http://schema.org/distribution",
          "label": "Distribution"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 49,
          "canBe": [
            "neuralactivity/electrophysiology/multitracegeneration/v0.1.0"
          ],
          "simpleAttributeName": "qualifiedGeneration",
          "attribute": "http://www.w3.org/ns/prov#qualifiedGeneration",
          "label": "Qualified generation"
        },
        {
          "numOfOccurences": 49,
          "canBe": [
            "neuralactivity/electrophysiology/stimulusexperiment/v0.1.0"
          ],
          "simpleAttributeName": "wasGeneratedBy",
          "attribute": "http://www.w3.org/ns/prov#wasGeneratedBy",
          "label": "Was generated by"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "channelName",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/channelName",
          "label": "Channel name"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "dataUnit",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/dataUnit",
          "label": "Data unit"
        },
        {
          "numOfOccurences": 49,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "partOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/partOf",
          "label": "Part of"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "timeStep",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/timeStep",
          "label": "Time step"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "minds/experiment/method/v1.0.0",
      "group": "minds",
      "label": "Method",
      "properties": [
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 133,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 133,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 167,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 126,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 126,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "methods",
          "canBe": [
            "minds/core/activity/v1.0.0",
            "minds/experiment/sample/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/methods",
          "label": "Methods",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/protein/v1.0.0",
      "group": "ontologies",
      "label": "Protein",
      "properties": [
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "charge",
          "attribute": "http://purl.obolibrary.org/obo/chebi/charge",
          "label": "Charge"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "formula",
          "attribute": "http://purl.obolibrary.org/obo/chebi/formula",
          "label": "Formula"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "inchi",
          "attribute": "http://purl.obolibrary.org/obo/chebi/inchi",
          "label": "Inchi"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "inchikey",
          "attribute": "http://purl.obolibrary.org/obo/chebi/inchikey",
          "label": "Inchikey"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "mass",
          "attribute": "http://purl.obolibrary.org/obo/chebi/mass",
          "label": "Mass"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "monoisotopicmass",
          "attribute": "http://purl.obolibrary.org/obo/chebi/monoisotopicmass",
          "label": "Monoisotopicmass"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "smiles",
          "attribute": "http://purl.obolibrary.org/obo/chebi/smiles",
          "label": "Smiles"
        },
        {
          "numOfOccurences": 27378,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 55,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 30,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "acronym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "bonfireID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bonfireID",
          "label": "Bonfire id"
        },
        {
          "numOfOccurences": 1487,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 832,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "externalSourceURI",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceURI",
          "label": "External source uri"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "gene_Ontology_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gene_Ontology_ID",
          "label": "Gene ontology id"
        },
        {
          "numOfOccurences": 89,
          "simpleAttributeName": "hasCurationStatus",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/hasCurationStatus",
          "label": "Has curation status"
        },
        {
          "numOfOccurences": 1470,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 91,
          "simpleAttributeName": "sao_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/sao_ID",
          "label": "Sao id"
        },
        {
          "numOfOccurences": 376,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "tempDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/tempDefinition",
          "label": "Temp definition"
        },
        {
          "numOfOccurences": 54,
          "simpleAttributeName": "umls_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/umls_ID",
          "label": "Umls id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "consider",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#consider",
          "label": "Consider"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "created_by",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#created_by",
          "label": "Created by"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "creation_date",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#creation_date",
          "label": "Creation date"
        },
        {
          "numOfOccurences": 37,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 459,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 2131,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 26851,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "hasNarrowSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym",
          "label": "Has narrow synonym"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 12654,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 27391,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 27376,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "changeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#changeNote",
          "label": "Change note"
        },
        {
          "numOfOccurences": 124,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 1521,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 30,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "acronym",
          "attribute": "https://schema.hbp.eu/ontologies/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 27496,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 28968,
          "canBe": [
            "ontologies/core/protein/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 27261,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 28969,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/protein/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/publicationid/v1.0.0",
      "group": "uniminds",
      "label": "Publicationid",
      "properties": [
        {
          "numOfOccurences": 84,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 84,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 84,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 84,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 79,
          "canBe": [
            "minds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 84,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 84,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 84,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 82,
          "canBe": [
            "uniminds/options/publicationidtype/v1.0.0"
          ],
          "simpleAttributeName": "publicationIdType",
          "attribute": "https://schema.hbp.eu/uniminds/publicationIdType",
          "label": "Publication id type"
        },
        {
          "simplePropertyName": "publication",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication",
          "reverse": true
        },
        {
          "simplePropertyName": "publicationId",
          "canBe": [
            "uniminds/core/publication/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/publicationId",
          "label": "Publication id",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/modelformat/v1.0.0",
      "group": "uniminds",
      "label": "Modelformat",
      "properties": [
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "modelFormat",
          "canBe": [
            "uniminds/core/modelinstance/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/modelFormat",
          "label": "Model format",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/core/person/v0.1.0",
      "group": "modelvalidation",
      "label": "Person",
      "properties": [
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "email",
          "attribute": "http://schema.org/email",
          "label": "Email"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "familyName",
          "attribute": "http://schema.org/familyName",
          "label": "Family name"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "givenName",
          "attribute": "http://schema.org/givenName",
          "label": "Given name"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 182,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "author",
          "canBe": [
            "modelvalidation/simulation/modelproject/v0.1.0",
            "modelvalidation/simulation/validationtestdefinition/v0.1.0"
          ],
          "attribute": "http://schema.org/author",
          "label": "Author",
          "reverse": true
        },
        {
          "simplePropertyName": "owner",
          "canBe": [
            "modelvalidation/simulation/modelproject/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/owner",
          "label": "Owner",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/parcellationregion/v1.0.0",
      "group": "minds",
      "label": "Parcellationregion",
      "properties": [
        {
          "numOfOccurences": 902,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 902,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 274,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 902,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 901,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 274,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 634,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 174,
          "simpleAttributeName": "alias",
          "attribute": "https://schema.hbp.eu/minds/alias",
          "label": "Alias"
        },
        {
          "numOfOccurences": 31,
          "canBe": [
            "minds/core/species/v1.0.0"
          ],
          "simpleAttributeName": "species",
          "attribute": "https://schema.hbp.eu/minds/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 597,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 597,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 902,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 902,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 902,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 68,
          "simpleAttributeName": "url",
          "attribute": "https://schema.hbp.eu/viewer/url",
          "label": "Url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "parcellationRegion",
          "canBe": [
            "minds/core/dataset/v1.0.0",
            "minds/experiment/sample/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/parcellationRegion",
          "label": "Parcellation region",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/software/v0.1.2",
      "group": "softwarecatalog",
      "label": "Software",
      "properties": [
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "softwarecatalog/options/applicationcategory/v1.0.0"
          ],
          "simpleAttributeName": "applicationCategory",
          "attribute": "http://schema.org/applicationCategory",
          "label": "Application category"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "softwarecatalog/options/applicationsubcategory/v1.0.0"
          ],
          "simpleAttributeName": "applicationSubCategory",
          "attribute": "http://schema.org/applicationSubCategory",
          "label": "Application sub category"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "citation",
          "attribute": "http://schema.org/citation",
          "label": "Citation"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/options/programminglanguage/v1.0.0"
          ],
          "simpleAttributeName": "encodingFormat",
          "attribute": "http://schema.org/encodingFormat",
          "label": "Encoding format"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "feature",
          "attribute": "http://schema.org/feature",
          "label": "Feature"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/software/software/v0.1.2"
          ],
          "simpleAttributeName": "hasPart",
          "attribute": "http://schema.org/hasPart",
          "label": "Has part"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "headline",
          "attribute": "http://schema.org/headline",
          "label": "Headline"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "isAccessibleForFree",
          "attribute": "http://schema.org/isAccessibleForFree",
          "label": "Is accessible for free"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "softwarecatalog/options/operatingsystem/v1.0.0"
          ],
          "simpleAttributeName": "operatingSystem",
          "attribute": "http://schema.org/operatingSystem",
          "label": "Operating system"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/software/softwareproject/v0.1.0"
          ],
          "simpleAttributeName": "project",
          "attribute": "http://schema.org/project",
          "label": "Project"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "releaseNotes",
          "attribute": "http://schema.org/releaseNotes",
          "label": "Release notes"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "requirements",
          "attribute": "http://schema.org/requirements",
          "label": "Requirements"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "version",
          "attribute": "http://schema.org/version",
          "label": "Version"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "hasPart",
          "canBe": [
            "softwarecatalog/software/software/v0.1.2"
          ],
          "attribute": "http://schema.org/hasPart",
          "label": "Has part",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuroglancer/viewer/neuroglancer/v0.0.1",
      "group": "neuroglancer",
      "label": "Neuroglancer",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/emodel/v0.1.1",
      "group": "modelvalidation",
      "label": "Emodel",
      "properties": [
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 514,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 507,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 516,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "eModel",
          "canBe": [
            "modelvalidation/simulation/memodel/v0.1.2"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/eModel",
          "label": "E model",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/experiment/patchedcell/v0.1.0",
      "group": "neuralactivity",
      "label": "Patchedcell",
      "properties": [
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "brainLocation",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainLocation",
          "label": "Brain location"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "chlorideReversalPotential",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/chlorideReversalPotential",
          "label": "Chloride reversal potential"
        },
        {
          "numOfOccurences": 73,
          "simpleAttributeName": "eType",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/eType",
          "label": "E type"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "hadMember",
          "canBe": [
            "neuralactivity/experiment/patchedcellcollection/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#hadMember",
          "label": "Had member",
          "reverse": true
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "neuralactivity/electrophysiology/stimulusexperiment/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/validationtestdefinition/v0.1.0",
      "group": "modelvalidation",
      "label": "Validationtestdefinition",
      "properties": [
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 40,
          "canBe": [
            "modelvalidation/core/person/v0.1.0"
          ],
          "simpleAttributeName": "author",
          "attribute": "http://schema.org/author",
          "label": "Author"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "dateCreated",
          "attribute": "http://schema.org/dateCreated",
          "label": "Date created"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "alias",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/alias",
          "label": "Alias"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "celltype",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/celltype",
          "label": "Celltype"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "dataType",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/dataType",
          "label": "Data type"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "recordingModality",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/recordingModality",
          "label": "Recording modality"
        },
        {
          "numOfOccurences": 40,
          "canBe": [
            "modelvalidation/simulation/analysisresult/v1.0.0"
          ],
          "simpleAttributeName": "referenceData",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/referenceData",
          "label": "Reference data"
        },
        {
          "numOfOccurences": 27,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "status",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/status",
          "label": "Status"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "testType",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/testType",
          "label": "Test type"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "implements",
          "canBe": [
            "modelvalidation/simulation/validationscript/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/implements",
          "label": "Implements",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/fundinginformation/v1.0.0",
      "group": "uniminds",
      "label": "Fundinginformation",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "grantId",
          "attribute": "https://schema.hbp.eu/uniminds/grantId",
          "label": "Grant id"
        },
        {
          "simplePropertyName": "fundingInformation",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/fundingInformation",
          "label": "Funding information",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/publicationidtype/v1.0.0",
      "group": "uniminds",
      "label": "Publicationidtype",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "publicationIdType",
          "canBe": [
            "uniminds/options/publicationid/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/publicationIdType",
          "label": "Publication id type",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/sex/v1.0.0",
      "group": "minds",
      "label": "Sex",
      "properties": [
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/options/sex/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        },
        {
          "simplePropertyName": "sex",
          "canBe": [
            "minds/experiment/subject/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/sex",
          "label": "Sex",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/rodentia/v1.0.0",
      "group": "ontologies",
      "label": "Rodentia",
      "properties": [
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "animalModel",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/animalModel",
          "label": "Animal model"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "antiquated",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/antiquated",
          "label": "Antiquated"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "birnlexDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexDefinition",
          "label": "Birnlex definition"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "bonfireID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bonfireID",
          "label": "Bonfire id"
        },
        {
          "numOfOccurences": 99,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 19,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "definingCitationID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationID",
          "label": "Defining citation id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "definingCitationURI",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationURI",
          "label": "Defining citation uri"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "externallySourcedDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externallySourcedDefinition",
          "label": "Externally sourced definition"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "gbifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifID",
          "label": "Gbif id"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "gbifTaxonKeyID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifTaxonKeyID",
          "label": "Gbif taxon key id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "imsrStandardStrainName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/imsrStandardStrainName",
          "label": "Imsr standard strain name"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "jaxMiceID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/jaxMiceID",
          "label": "Jax mice id"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "misnomer",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/misnomer",
          "label": "Misnomer"
        },
        {
          "numOfOccurences": 85,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "ncbiIncludesName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiIncludesName",
          "label": "Ncbi includes name"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "ncbiTaxGenbankCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxGenbankCommonName",
          "label": "Ncbi tax genbank common name"
        },
        {
          "numOfOccurences": 24,
          "simpleAttributeName": "ncbiTaxID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxID",
          "label": "Ncbi tax id"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "ncbiTaxScientificName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxScientificName",
          "label": "Ncbi tax scientific name"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 24,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "taxonomicCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/taxonomicCommonName",
          "label": "Taxonomic common name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "tempDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/tempDefinition",
          "label": "Temp definition"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "UmlsCui",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/UmlsCui",
          "label": "Umls cui"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "usageNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/usageNote",
          "label": "Usage note"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 265,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 158,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 265,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 82,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 265,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "versionInfo",
          "attribute": "http://www.w3.org/2002/07/owl#versionInfo",
          "label": "Version info"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 89,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "scopeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#scopeNote",
          "label": "Scope note"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 80,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 378,
          "canBe": [
            "ontologies/core/rodentia/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 196,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 379,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/rodentia/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/simulation/emodelscript/v0.1.0",
      "group": "neuralactivity",
      "label": "Emodelscript",
      "properties": [
        {
          "numOfOccurences": 385,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 385,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 370,
          "simpleAttributeName": "distribution",
          "attribute": "http://schema.org/distribution",
          "label": "Distribution"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "license",
          "attribute": "http://schema.org/license",
          "label": "License"
        },
        {
          "numOfOccurences": 385,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 235,
          "simpleAttributeName": "code_format",
          "attribute": "https://schema.hbp.eu/neuralactivity/simulation/emodelscript/v0.1.0/code_format",
          "label": "Code format"
        },
        {
          "numOfOccurences": 385,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 385,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 385,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "mainModelScript",
          "canBe": [
            "neuralactivity/simulation/memodel/v0.1.2",
            "neuralactivity/simulation/modelinstance/v0.1.1"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/mainModelScript",
          "label": "Main model script",
          "reverse": true
        }
      ]
    },
    {
      "id": "brainviewer/viewer/link/v1.0.0",
      "group": "brainviewer",
      "label": "Link",
      "properties": [
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 41,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "dataset",
          "attribute": "https://schema.hbp.eu/brainviewer/dataset",
          "label": "Dataset"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "link",
          "attribute": "https://schema.hbp.eu/brainviewer/link",
          "label": "Link"
        },
        {
          "numOfOccurences": 85,
          "canBe": [
            "minds/experiment/sample/v1.0.0"
          ],
          "simpleAttributeName": "reference",
          "attribute": "https://schema.hbp.eu/brainviewer/reference",
          "label": "Reference"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "referenceSpace",
          "attribute": "https://schema.hbp.eu/brainviewer/referenceSpace",
          "label": "Reference space"
        },
        {
          "numOfOccurences": 43,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 43,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 43,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/experiment/patchedslice/v0.1.0",
      "group": "neuralactivity",
      "label": "Patchedslice",
      "properties": [
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 75,
          "canBe": [
            "neuralactivity/core/slice/v0.1.0"
          ],
          "simpleAttributeName": "wasRevisionOf",
          "attribute": "http://www.w3.org/ns/prov#wasRevisionOf",
          "label": "Was revision of"
        },
        {
          "numOfOccurences": 75,
          "canBe": [
            "neuralactivity/experiment/patchedcellcollection/v0.1.0"
          ],
          "simpleAttributeName": "hasPart",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/hasPart",
          "label": "Has part"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "generated",
          "canBe": [
            "neuralactivity/experiment/wholecellpatchclamp/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#generated",
          "label": "Generated",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/morphology/v0.1.1",
      "group": "modelvalidation",
      "label": "Morphology",
      "properties": [
        {
          "numOfOccurences": 519,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 519,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 68,
          "simpleAttributeName": "distribution",
          "attribute": "http://schema.org/distribution",
          "label": "Distribution"
        },
        {
          "numOfOccurences": 519,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 504,
          "simpleAttributeName": "modelOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/modelOf",
          "label": "Model of"
        },
        {
          "numOfOccurences": 519,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 519,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 519,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "morphology",
          "canBe": [
            "modelvalidation/simulation/memodel/v0.1.2"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/morphology",
          "label": "Morphology",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/softwareproject/v1.0.0",
      "group": "softwarecatalog",
      "label": "Softwareproject",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "softwarecatalog/software/softwarefeature/v1.0.0",
      "group": "softwarecatalog",
      "label": "Softwarefeature",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "softwarecatalog/software/softwarefeaturecategory/v1.0.0"
          ],
          "simpleAttributeName": "category",
          "attribute": "http://schema.org/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "feature",
          "attribute": "http://schema.org/feature",
          "label": "Feature"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "feature",
          "canBe": [
            "softwarecatalog/software/software/v1.0.0"
          ],
          "attribute": "http://schema.org/feature",
          "label": "Feature",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/modelinstance/v1.0.0",
      "group": "uniminds",
      "label": "Modelinstance",
      "properties": [
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 170,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "license",
          "attribute": "http://schema.org/license",
          "label": "License"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 170,
          "simpleAttributeName": "version",
          "attribute": "http://schema.org/version",
          "label": "Version"
        },
        {
          "numOfOccurences": 30,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 71,
          "canBe": [
            "uniminds/options/abstractionlevel/v1.0.0"
          ],
          "simpleAttributeName": "abstractionLevel",
          "attribute": "https://schema.hbp.eu/uniminds/abstractionLevel",
          "label": "Abstraction level"
        },
        {
          "numOfOccurences": 155,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainStructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure"
        },
        {
          "numOfOccurences": 22,
          "canBe": [
            "uniminds/options/cellulartarget/v1.0.0"
          ],
          "simpleAttributeName": "cellularTarget",
          "attribute": "https://schema.hbp.eu/uniminds/cellularTarget",
          "label": "Cellular target"
        },
        {
          "numOfOccurences": 162,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "contributor",
          "attribute": "https://schema.hbp.eu/uniminds/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 162,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "custodian",
          "attribute": "https://schema.hbp.eu/uniminds/custodian",
          "label": "Custodian"
        },
        {
          "numOfOccurences": 162,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "mainContact",
          "attribute": "https://schema.hbp.eu/uniminds/mainContact",
          "label": "Main contact"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "uniminds/options/modelformat/v1.0.0"
          ],
          "simpleAttributeName": "modelFormat",
          "attribute": "https://schema.hbp.eu/uniminds/modelFormat",
          "label": "Model format"
        },
        {
          "numOfOccurences": 169,
          "canBe": [
            "uniminds/options/modelscope/v1.0.0"
          ],
          "simpleAttributeName": "modelScope",
          "attribute": "https://schema.hbp.eu/uniminds/modelScope",
          "label": "Model scope"
        },
        {
          "numOfOccurences": 20,
          "canBe": [
            "uniminds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "publication",
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "simplePropertyName": "modelInstance",
          "canBe": [
            "uniminds/core/filebundle/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/modelInstance",
          "label": "Model instance",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/prov/role/v0.0.1",
      "group": "minds",
      "label": "Role",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "demo/core/dataset/v1.0.0",
      "group": "demo",
      "label": "Dataset",
      "properties": [
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "canBe": [
            "demo/core/person/v1.0.0"
          ],
          "simpleAttributeName": "contributor",
          "attribute": "https://schema.hbp.eu/demo/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "demo/core/person/v1.0.0"
          ],
          "simpleAttributeName": "custodian",
          "attribute": "https://schema.hbp.eu/demo/custodian",
          "label": "Custodian"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "demo/options/species/v1.0.0"
          ],
          "simpleAttributeName": "species",
          "attribute": "https://schema.hbp.eu/demo/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "bookmarkInstanceLink",
          "canBe": [
            "hbpkg/core/bookmark/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkInstanceLink",
          "label": "Bookmark instance link",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/organization/v1.0.0",
      "group": "uniminds",
      "label": "Organization",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "createdAs",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/createdAs",
          "label": "Created as",
          "reverse": true
        }
      ]
    },
    {
      "id": "mindsimportscripts/core/dataset/v1.0.0",
      "group": "mindsimportscripts",
      "label": "Dataset",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "knownContainers",
          "attribute": "https://schema.hbp.eu/import/knownContainers",
          "label": "Known containers"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "uniminds/options/abstractionlevel/v1.0.0",
      "group": "uniminds",
      "label": "Abstractionlevel",
      "properties": [
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "abstractionLevel",
          "canBe": [
            "uniminds/core/modelinstance/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/abstractionLevel",
          "label": "Abstraction level",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/person/v1.0.0",
      "group": "minds",
      "label": "Person",
      "properties": [
        {
          "numOfOccurences": 638,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 638,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 342,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 638,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 637,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "shortName",
          "attribute": "http://schema.org/shortName",
          "label": "Short name"
        },
        {
          "numOfOccurences": 342,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 317,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 544,
          "simpleAttributeName": "shortName",
          "attribute": "https://schema.hbp.eu/minds/shortName",
          "label": "Short name"
        },
        {
          "numOfOccurences": 265,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 265,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 56,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 638,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 638,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 638,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "authors",
          "canBe": [
            "minds/core/publication/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/authors",
          "label": "Authors",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "bookmarkInstanceLink",
          "canBe": [
            "hbpkg/core/bookmark/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkInstanceLink",
          "label": "Bookmark instance link",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        },
        {
          "simplePropertyName": "contributors",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/contributors",
          "label": "Contributors",
          "reverse": true
        },
        {
          "simplePropertyName": "owners",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/owners",
          "label": "Owners",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/prov/release/v0.0.1",
      "group": "minds",
      "label": "Release",
      "properties": [
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "releaseinstance",
          "attribute": "http://hbp.eu/minds#releaseinstance",
          "label": "Releaseinstance"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "releasestate",
          "attribute": "http://hbp.eu/minds#releasestate",
          "label": "Releasestate"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "ontologies/core/disease/v1.0.0",
      "group": "ontologies",
      "label": "Disease",
      "properties": [
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4535,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "description",
          "attribute": "http://purl.org/dc/elements/1.1/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 30,
          "simpleAttributeName": "acronym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "birnlexDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexDefinition",
          "label": "Birnlex definition"
        },
        {
          "numOfOccurences": 344,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 126,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "externallySourcedDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externallySourcedDefinition",
          "label": "Externally sourced definition"
        },
        {
          "numOfOccurences": 305,
          "simpleAttributeName": "MeshUid",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/MeshUid",
          "label": "Mesh uid"
        },
        {
          "numOfOccurences": 328,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 65,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 63,
          "simpleAttributeName": "putativeClassExtension",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/putativeClassExtension",
          "label": "Putative class extension"
        },
        {
          "numOfOccurences": 278,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "umls_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/umls_ID",
          "label": "Umls id"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "UmlsCui",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/UmlsCui",
          "label": "Umls cui"
        },
        {
          "numOfOccurences": 77,
          "simpleAttributeName": "usageNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/usageNote",
          "label": "Usage note"
        },
        {
          "numOfOccurences": 760,
          "simpleAttributeName": "created_by",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#created_by",
          "label": "Created by"
        },
        {
          "numOfOccurences": 760,
          "simpleAttributeName": "creation_date",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#creation_date",
          "label": "Creation date"
        },
        {
          "numOfOccurences": 688,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 8062,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 6063,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "hasNarrowSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym",
          "label": "Has narrow synonym"
        },
        {
          "numOfOccurences": 7119,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 356,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 8546,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 997,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 9027,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "versionInfo",
          "attribute": "http://www.w3.org/2002/07/owl#versionInfo",
          "label": "Version info"
        },
        {
          "numOfOccurences": 269,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 19,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "example",
          "attribute": "http://www.w3.org/2004/02/skos/core#example",
          "label": "Example"
        },
        {
          "numOfOccurences": 328,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 23,
          "simpleAttributeName": "scopeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#scopeNote",
          "label": "Scope note"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 30,
          "simpleAttributeName": "acronym",
          "attribute": "https://schema.hbp.eu/ontologies/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 4804,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 9027,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 9030,
          "canBe": [
            "ontologies/core/disease/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 6393,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 9031,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/disease/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/ethicsauthority/v1.0.0",
      "group": "uniminds",
      "label": "Ethicsauthority",
      "properties": [
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 36,
          "canBe": [
            "minds/ethics/authority/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 39,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "ethicsAuthority",
          "canBe": [
            "uniminds/core/ethicsapproval/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/ethicsAuthority",
          "label": "Ethics authority",
          "reverse": true
        }
      ]
    },
    {
      "id": "demo/core/file/v1.0.0",
      "group": "demo",
      "label": "File",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "hbpkg/core/invitation/v1.0.0",
      "group": "hbpkg",
      "label": "Invitation",
      "properties": [
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 28,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "instance",
          "attribute": "https://schema.hbp.eu/hbpkg/instance",
          "label": "Instance"
        },
        {
          "numOfOccurences": 28,
          "canBe": [
            "hbpkg/core/user/v0.0.1"
          ],
          "simpleAttributeName": "user",
          "attribute": "https://schema.hbp.eu/hbpkg/user",
          "label": "User"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "minds/core/fileassociation/v1.0.0",
      "group": "minds",
      "label": "Fileassociation",
      "properties": [
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 81032,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 83537,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "from",
          "attribute": "https://schema.hbp.eu/linkinginstance/from",
          "label": "From"
        },
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "to",
          "attribute": "https://schema.hbp.eu/linkinginstance/to",
          "label": "To"
        },
        {
          "numOfOccurences": 2087,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2087,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 84359,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/prov/role/v1.0.0",
      "group": "minds",
      "label": "Role",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "hadRole",
          "canBe": [
            "minds/core/placomponent/v1.0.0",
            "minds/experiment/subject/v1.0.0",
            "minds/core/dataset/v1.0.0",
            "minds/experiment/sample/v1.0.0",
            "minds/core/parcellationregion/v1.0.0",
            "minds/core/activity/v1.0.0",
            "minds/ethics/authority/v1.0.0",
            "minds/ethics/approval/v1.0.0",
            "minds/experiment/method/v1.0.0",
            "minds/core/person/v1.0.0",
            "minds/experiment/protocol/v1.0.0",
            "minds/core/publication/v1.0.0",
            "minds/core/specimengroup/v1.0.0",
            "minds/core/format/v1.0.0",
            "minds/core/sex/v1.0.0",
            "minds/core/preparation/v1.0.0",
            "minds/core/species/v1.0.0",
            "minds/core/agecategory/v1.0.0",
            "minds/core/referencespace/v1.0.0",
            "minds/core/embargostatus/v1.0.0",
            "minds/core/parcellationatlas/v1.0.0",
            "minds/core/licensetype/v1.0.0",
            "minds/core/method/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#hadRole",
          "label": "Had role",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/parcellationregion/v1.0.1",
      "group": "ontologies",
      "label": "Parcellationregion",
      "properties": [
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 378,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 47,
          "simpleAttributeName": "IAO_0000116",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000116",
          "label": "Iao 0000116"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "IAO_0000232",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000232",
          "label": "Iao 0000232"
        },
        {
          "numOfOccurences": 67,
          "simpleAttributeName": "UBPROP_0000001",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000001",
          "label": "Ubprop 0000001"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "UBPROP_0000002",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000002",
          "label": "Ubprop 0000002"
        },
        {
          "numOfOccurences": 42,
          "simpleAttributeName": "UBPROP_0000003",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000003",
          "label": "Ubprop 0000003"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "UBPROP_0000007",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000007",
          "label": "Ubprop 0000007"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "UBPROP_0000008",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000008",
          "label": "Ubprop 0000008"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "UBPROP_0000009",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000009",
          "label": "Ubprop 0000009"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "UBPROP_0000010",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000010",
          "label": "Ubprop 0000010"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "UBPROP_0000011",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000011",
          "label": "Ubprop 0000011"
        },
        {
          "numOfOccurences": 49,
          "simpleAttributeName": "UBPROP_0000012",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000012",
          "label": "Ubprop 0000012"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "UBPROP_0000013",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000013",
          "label": "Ubprop 0000013"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "UBPROP_0000015",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000015",
          "label": "Ubprop 0000015"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "date",
          "attribute": "http://purl.org/dc/elements/1.1/date",
          "label": "Date"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://purl.org/dc/elements/1.1/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "bibliographicCitation",
          "attribute": "http://purl.org/dc/terms/bibliographicCitation",
          "label": "Bibliographic citation"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "dateCopyrighted",
          "attribute": "http://purl.org/dc/terms/dateCopyrighted",
          "label": "Date copyrighted"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 120,
          "simpleAttributeName": "hasWeirdParenValue",
          "attribute": "http://uri.interlex.org/berman/uris/readable/hasWeirdParenValue",
          "label": "Has weird paren value"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "artifactVersion",
          "attribute": "http://uri.interlex.org/tgbugs/uris/readable/artifactVersion",
          "label": "Artifact version"
        },
        {
          "numOfOccurences": 3991,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 180,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 984,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 191,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 534,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 437,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "hasNarrowSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym",
          "label": "Has narrow synonym"
        },
        {
          "numOfOccurences": 534,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 473,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 534,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 27,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 7668,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 180,
          "simpleAttributeName": "altLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#altLabel",
          "label": "Alt label"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 7073,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 3991,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 534,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 383,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7668,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 7664,
          "canBe": [
            "ontologies/core/parcellationregion/v1.0.1"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 7603,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 7669,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/parcellationregion/v1.0.1"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/publication/v1.0.0",
      "group": "minds",
      "label": "Publication",
      "properties": [
        {
          "numOfOccurences": 134,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 134,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 65,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 134,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 133,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 65,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 73,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 130,
          "canBe": [
            "minds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "authors",
          "attribute": "https://schema.hbp.eu/minds/authors",
          "label": "Authors"
        },
        {
          "numOfOccurences": 130,
          "simpleAttributeName": "cite",
          "attribute": "https://schema.hbp.eu/minds/cite",
          "label": "Cite"
        },
        {
          "numOfOccurences": 129,
          "simpleAttributeName": "doi",
          "attribute": "https://schema.hbp.eu/minds/doi",
          "label": "Doi"
        },
        {
          "numOfOccurences": 57,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 57,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 134,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 134,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 134,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "publications",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/publications",
          "label": "Publications",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/core/publication/v1.0.0",
            "uniminds/options/publicationid/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/experiment/sample/v1.0.0",
      "group": "minds",
      "label": "Sample",
      "properties": [
        {
          "numOfOccurences": 1679,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1679,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1179,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1679,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1679,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1179,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 826,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1114,
          "simpleAttributeName": "container_url",
          "attribute": "https://schema.hbp.eu/minds/container_url",
          "label": "Container url"
        },
        {
          "numOfOccurences": 1608,
          "canBe": [
            "minds/experiment/method/v1.0.0"
          ],
          "simpleAttributeName": "methods",
          "attribute": "https://schema.hbp.eu/minds/methods",
          "label": "Methods"
        },
        {
          "numOfOccurences": 1545,
          "canBe": [
            "minds/core/parcellationatlas/v1.0.0"
          ],
          "simpleAttributeName": "parcellationAtlas",
          "attribute": "https://schema.hbp.eu/minds/parcellationAtlas",
          "label": "Parcellation atlas"
        },
        {
          "numOfOccurences": 1606,
          "canBe": [
            "minds/core/parcellationregion/v1.0.0"
          ],
          "simpleAttributeName": "parcellationRegion",
          "attribute": "https://schema.hbp.eu/minds/parcellationRegion",
          "label": "Parcellation region"
        },
        {
          "numOfOccurences": 62,
          "simpleAttributeName": "weightPostFixation",
          "attribute": "https://schema.hbp.eu/minds/weightPostFixation",
          "label": "Weight post fixation"
        },
        {
          "numOfOccurences": 62,
          "simpleAttributeName": "weightPreFixation",
          "attribute": "https://schema.hbp.eu/minds/weightPreFixation",
          "label": "Weight pre fixation"
        },
        {
          "numOfOccurences": 457,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 457,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 1679,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1679,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1679,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "reference",
          "canBe": [
            "brainviewer/viewer/link/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/brainviewer/reference",
          "label": "Reference",
          "reverse": true
        },
        {
          "simplePropertyName": "v1.0.0",
          "canBe": [
            "cscs/core/file/v1.0.0"
          ],
          "attribute": "minds/core/fileassociation/v1.0.0",
          "label": "V 1 . 0 . 0",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "samples",
          "canBe": [
            "minds/experiment/subject/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/samples",
          "label": "Samples",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/hbpcomponent/v1.0.0",
      "group": "uniminds",
      "label": "Hbpcomponent",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "associatedTask",
          "attribute": "https://schema.hbp.eu/uniminds/associatedTask",
          "label": "Associated task"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "componentOwner",
          "attribute": "https://schema.hbp.eu/uniminds/componentOwner",
          "label": "Component owner"
        },
        {
          "simplePropertyName": "hbpComponent",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/hbpComponent",
          "label": "Hbp component",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/project/v1.0.0",
      "group": "uniminds",
      "label": "Project",
      "properties": [
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 9,
          "canBe": [
            "uniminds/core/person/v1.0.0"
          ],
          "simpleAttributeName": "coordinator",
          "attribute": "https://schema.hbp.eu/uniminds/coordinator",
          "label": "Coordinator"
        },
        {
          "simplePropertyName": "project",
          "canBe": [
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/publication/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/project",
          "label": "Project",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/studytargetsource/v1.0.0",
      "group": "uniminds",
      "label": "Studytargetsource",
      "properties": [
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "studyTargetSource",
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/studyTargetSource",
          "label": "Study target source",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/referencespace/v1.0.0",
      "group": "minds",
      "label": "Referencespace",
      "properties": [
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "reference_space",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/reference_space",
          "label": "Reference space",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/electrophysiology/stimulusexperiment/v0.1.0",
      "group": "neuralactivity",
      "label": "Stimulusexperiment",
      "properties": [
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 50,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 75,
          "canBe": [
            "neuralactivity/experiment/patchedcell/v0.1.0"
          ],
          "simpleAttributeName": "used",
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "stimulus",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/stimulus",
          "label": "Stimulus"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "name",
          "attribute": "https://schema.hbp.eu/neuralactivity/electrophysiology/stimulusexperiment/v0.1.0/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "activity",
          "canBe": [
            "neuralactivity/electrophysiology/multitracegeneration/v0.1.0",
            "neuralactivity/electrophysiology/tracegeneration/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#activity",
          "label": "Activity",
          "reverse": true
        },
        {
          "simplePropertyName": "wasGeneratedBy",
          "canBe": [
            "neuralactivity/electrophysiology/multitrace/v0.1.0",
            "neuralactivity/electrophysiology/trace/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasGeneratedBy",
          "label": "Was generated by",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/softwarefeaturesubcategory/v0.1.0",
      "group": "softwarecatalog",
      "label": "Softwarefeaturesubcategory",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/software/softwarefeature/v0.1.0"
          ],
          "simpleAttributeName": "feature",
          "attribute": "http://schema.org/feature",
          "label": "Feature"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "uniminds/options/country/v1.0.0",
      "group": "uniminds",
      "label": "Country",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "countryOfOrigin",
          "canBe": [
            "uniminds/core/ethicsapproval/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/countryOfOrigin",
          "label": "Country of origin",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/options/applicationcategory/v1.0.0",
      "group": "softwarecatalog",
      "label": "Applicationcategory",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "applicationCategory",
          "canBe": [
            "softwarecatalog/software/software/v0.1.2",
            "softwarecatalog/software/software/v1.0.0"
          ],
          "attribute": "http://schema.org/applicationCategory",
          "label": "Application category",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/softwarefeaturecategory/v1.0.0",
      "group": "softwarecatalog",
      "label": "Softwarefeaturecategory",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/software/softwarefeaturecategory/v1.0.0"
          ],
          "simpleAttributeName": "parentCategory",
          "attribute": "http://schema.org/parentCategory",
          "label": "Parent category"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "category",
          "canBe": [
            "softwarecatalog/software/softwarefeature/v1.0.0"
          ],
          "attribute": "http://schema.org/category",
          "label": "Category",
          "reverse": true
        },
        {
          "simplePropertyName": "parentCategory",
          "canBe": [
            "softwarecatalog/software/softwarefeaturecategory/v1.0.0"
          ],
          "attribute": "http://schema.org/parentCategory",
          "label": "Parent category",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/core/slice/v0.1.0",
      "group": "neuralactivity",
      "label": "Slice",
      "properties": [
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 75,
          "canBe": [
            "neuralactivity/core/subject/v0.1.2",
            "neuralactivity/core/subject/v0.1.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "wasRevisionOf",
          "canBe": [
            "neuralactivity/experiment/patchedslice/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasRevisionOf",
          "label": "Was revision of",
          "reverse": true
        },
        {
          "simplePropertyName": "generated",
          "canBe": [
            "neuralactivity/experiment/brainslicing/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#generated",
          "label": "Generated",
          "reverse": true
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "neuralactivity/experiment/wholecellpatchclamp/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/handedness/v1.0.0",
      "group": "uniminds",
      "label": "Handedness",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "handedness",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/handedness",
          "label": "Handedness",
          "reverse": true
        }
      ]
    },
    {
      "id": "hbpkg/core/bookmark/v0.0.1",
      "group": "hbpkg",
      "label": "Bookmark",
      "properties": [
        {
          "numOfOccurences": 37,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 37,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 37,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 37,
          "canBe": [
            "minds/core/dataset/v1.0.0",
            "minds/core/person/v1.0.0",
            "demo/core/dataset/v1.0.0",
            "uniminds/core/dataset/v1.0.0",
            "minds/core/placomponent/v1.0.0"
          ],
          "simpleAttributeName": "bookmarkInstanceLink",
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkInstanceLink",
          "label": "Bookmark instance link"
        },
        {
          "numOfOccurences": 37,
          "canBe": [
            "hbpkg/core/bookmarklist/v0.0.1"
          ],
          "simpleAttributeName": "bookmarkList",
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkList",
          "label": "Bookmark list"
        },
        {
          "numOfOccurences": 33,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 33,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 37,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 37,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 37,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "minds/experiment/protocol/v1.0.0",
      "group": "minds",
      "label": "Protocol",
      "properties": [
        {
          "numOfOccurences": 340,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 340,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 231,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 340,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 340,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 231,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 103,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 340,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 340,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 340,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "protocols",
          "canBe": [
            "minds/core/activity/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/protocols",
          "label": "Protocols",
          "reverse": true
        }
      ]
    },
    {
      "id": "datacite/core/doi/v0.0.1",
      "group": "datacite",
      "label": "Doi",
      "properties": [
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 170,
          "simpleAttributeName": "citation",
          "attribute": "http://hbp.eu/minds#citation",
          "label": "Citation"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "doi",
          "attribute": "http://hbp.eu/minds#doi",
          "label": "Doi"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "doireference",
          "attribute": "http://hbp.eu/minds#doireference",
          "label": "Doireference"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "releaseinstance",
          "canBe": [
            "datacite/prov/release/v0.0.1"
          ],
          "attribute": "http://hbp.eu/minds#releaseinstance",
          "label": "Releaseinstance",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/file/v1.0.0",
      "group": "uniminds",
      "label": "File",
      "properties": [
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "url",
          "attribute": "http://schema.org/url",
          "label": "Url"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainStructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "simpleAttributeName": "method",
          "attribute": "https://schema.hbp.eu/uniminds/method",
          "label": "Method"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/options/mimetype/v1.0.0"
          ],
          "simpleAttributeName": "mimeType",
          "attribute": "https://schema.hbp.eu/uniminds/mimeType",
          "label": "Mime type"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/core/subject/v1.0.0"
          ],
          "simpleAttributeName": "subject",
          "attribute": "https://schema.hbp.eu/uniminds/subject",
          "label": "Subject"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "simpleAttributeName": "subjectGroup",
          "attribute": "https://schema.hbp.eu/uniminds/subjectGroup",
          "label": "Subject group"
        },
        {
          "simplePropertyName": "file",
          "canBe": [
            "uniminds/core/filebundle/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/file",
          "label": "File",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/methodcategory/v1.0.0",
      "group": "uniminds",
      "label": "Methodcategory",
      "properties": [
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "methodCategory",
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/methodCategory",
          "label": "Method category",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/options/applicationsubcategory/v1.0.0",
      "group": "softwarecatalog",
      "label": "Applicationsubcategory",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "applicationSubCategory",
          "canBe": [
            "softwarecatalog/software/software/v0.1.2"
          ],
          "attribute": "http://schema.org/applicationSubCategory",
          "label": "Application sub category",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/test/test/v1.0.0",
      "group": "modelvalidation",
      "label": "Test",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "neuralactivity/simulation/modelproject/v0.1.0",
      "group": "neuralactivity",
      "label": "Modelproject",
      "properties": [
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 288,
          "canBe": [
            "neuralactivity/simulation/memodel/v0.1.2",
            "neuralactivity/simulation/modelinstance/v0.1.1"
          ],
          "simpleAttributeName": "hasPart",
          "attribute": "http://purl.org/dc/terms/hasPart",
          "label": "Has part"
        },
        {
          "numOfOccurences": 331,
          "canBe": [
            "neuralactivity/core/person/v0.1.0"
          ],
          "simpleAttributeName": "author",
          "attribute": "http://schema.org/author",
          "label": "Author"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "dateCreated",
          "attribute": "http://schema.org/dateCreated",
          "label": "Date created"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "abstractionLevel",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/abstractionLevel",
          "label": "Abstraction level"
        },
        {
          "numOfOccurences": 23,
          "simpleAttributeName": "alias",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/alias",
          "label": "Alias"
        },
        {
          "numOfOccurences": 308,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 287,
          "simpleAttributeName": "celltype",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/celltype",
          "label": "Celltype"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "collabID",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/collabID",
          "label": "Collab id"
        },
        {
          "numOfOccurences": 314,
          "simpleAttributeName": "modelOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/modelOf",
          "label": "Model of"
        },
        {
          "numOfOccurences": 285,
          "canBe": [
            "neuralactivity/core/organization/v0.1.0"
          ],
          "simpleAttributeName": "organization",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/organization",
          "label": "Organization"
        },
        {
          "numOfOccurences": 331,
          "canBe": [
            "neuralactivity/core/person/v0.1.0"
          ],
          "simpleAttributeName": "owner",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/owner",
          "label": "Owner"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "private",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/private",
          "label": "Private"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 292,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "images",
          "attribute": "https://schema.hbp.eu/neuralactivity/simulation/modelproject/v0.1.0/images",
          "label": "Images"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 331,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "minds/core/format/v1.0.0",
      "group": "minds",
      "label": "Format",
      "properties": [
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 19,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 19,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 46,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 38,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 38,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "formats",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/formats",
          "label": "Formats",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "demo/core/modelinstance/v1.0.0",
      "group": "demo",
      "label": "Modelinstance",
      "properties": [
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "uniminds/options/species/v1.0.0",
      "group": "uniminds",
      "label": "Species",
      "properties": [
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "minds/core/species/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "species",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/species",
          "label": "Species",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/core/subject/v0.1.0",
      "group": "neuralactivity",
      "label": "Subject",
      "properties": [
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "age",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/age",
          "label": "Age"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "sex",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/sex",
          "label": "Sex"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "strain",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/strain",
          "label": "Strain"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "neuralactivity/experiment/brainslicing/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "neuralactivity/core/slice/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/core/subject/v0.1.2",
      "group": "neuralactivity",
      "label": "Subject",
      "properties": [
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "age",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/age",
          "label": "Age"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "strain",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/strain",
          "label": "Strain"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 31,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "neuralactivity/experiment/brainslicing/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "neuralactivity/core/slice/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "neuralactivity/core/person/v0.1.0",
      "group": "neuralactivity",
      "label": "Person",
      "properties": [
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "neuralactivity/core/organization/v0.1.0"
          ],
          "simpleAttributeName": "affiliation",
          "attribute": "http://schema.org/affiliation",
          "label": "Affiliation"
        },
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "email",
          "attribute": "http://schema.org/email",
          "label": "Email"
        },
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "familyName",
          "attribute": "http://schema.org/familyName",
          "label": "Family name"
        },
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "givenName",
          "attribute": "http://schema.org/givenName",
          "label": "Given name"
        },
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 186,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "author",
          "canBe": [
            "neuralactivity/simulation/modelproject/v0.1.0"
          ],
          "attribute": "http://schema.org/author",
          "label": "Author",
          "reverse": true
        },
        {
          "simplePropertyName": "wasAssociatedWith",
          "canBe": [
            "neuralactivity/experiment/wholecellpatchclamp/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasAssociatedWith",
          "label": "Was associated with",
          "reverse": true
        },
        {
          "simplePropertyName": "owner",
          "canBe": [
            "neuralactivity/simulation/modelproject/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/owner",
          "label": "Owner",
          "reverse": true
        },
        {
          "simplePropertyName": "wasAssociatedWith",
          "canBe": [
            "neuralactivity/experiment/brainslicing/v0.1.0"
          ],
          "attribute": "https://schema.hbp.eu/neuralactivity/experiment/brainslicing/v0.1.0/wasAssociatedWith",
          "label": "Was associated with",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/embargostatus/v1.0.0",
      "group": "minds",
      "label": "Embargostatus",
      "properties": [
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "embargo_status",
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/embargo_status",
          "label": "Embargo status",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/options/embargostatus/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/modelscope/v1.0.0",
      "group": "uniminds",
      "label": "Modelscope",
      "properties": [
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "modelScope",
          "canBe": [
            "uniminds/core/modelinstance/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/modelScope",
          "label": "Model scope",
          "reverse": true
        }
      ]
    },
    {
      "id": "releasing/prov/release/v0.0.2",
      "group": "releasing",
      "label": "Release",
      "properties": [
        {
          "numOfOccurences": 60200,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 60200,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 60200,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 179,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 60173,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 60173,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 60200,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 60200,
          "canBe": [
            "minds/core/fileassociation/v1.0.0",
            "cscs/core/file/v1.0.0",
            "minds/experiment/protocol/v1.0.0",
            "brainviewer/viewer/link/v1.0.0",
            "minds/experiment/sample/v1.0.0",
            "neuroglancer/viewer/neuroglancer/v1.0.0",
            "minds/experiment/method/v1.0.0",
            "minds/experiment/subject/v1.0.0",
            "hbppreview/core/filepreview/v1.0.0",
            "minds/core/dataset/v1.0.0",
            "minds/core/person/v1.0.0",
            "minds/core/parcellationregion/v1.0.0",
            "datacite/core/doi/v1.0.0",
            "minds/core/activity/v1.0.0",
            "minds/core/publication/v1.0.0",
            "minds/core/parcellationatlas/v1.0.0",
            "minds/core/specimengroup/v1.0.0",
            "minds/core/modality/v1.0.0",
            "uniminds/core/person/v1.0.0",
            "uniminds/options/modelscope/v1.0.0",
            "minds/core/placomponent/v1.0.0",
            "uniminds/options/cellulartarget/v1.0.0",
            "uniminds/core/filebundle/v1.0.0",
            "minds/ethics/authority/v1.0.0",
            "uniminds/core/publication/v1.0.0",
            "minds/core/licensetype/v1.0.0",
            "uniminds/core/modelinstance/v1.0.0",
            "minds/core/species/v1.0.0",
            "minds/core/agecategory/v1.0.0",
            "uniminds/options/sex/v1.0.0",
            "uniminds/core/studytarget/v1.0.0",
            "minds/core/format/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0",
            "minds/core/embargostatus/v1.0.0",
            "uniminds/options/handedness/v1.0.0",
            "minds/core/sex/v1.0.0",
            "minds/core/preparation/v1.0.0",
            "uniminds/options/brainstructure/v1.0.0",
            "licenses/core/information/v1.0.0",
            "uniminds/options/agecategory/v1.0.0",
            "minds/core/referencespace/v1.0.0",
            "uniminds/options/abstractionlevel/v1.0.0",
            "uniminds/options/modelformat/v1.0.0",
            "minds/prov/role/v1.0.0",
            "minds/core/method/v1.0.0",
            "minds/ethics/approval/v1.0.0",
            "minds/core/softwareagent/v1.0.0"
          ],
          "simpleAttributeName": "instance",
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance"
        },
        {
          "numOfOccurences": 60200,
          "simpleAttributeName": "revision",
          "attribute": "https://schema.hbp.eu/release/revision",
          "label": "Revision"
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/modelinstance/v0.1.1",
      "group": "modelvalidation",
      "label": "Modelinstance",
      "properties": [
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "version",
          "attribute": "http://schema.org/version",
          "label": "Version"
        },
        {
          "numOfOccurences": 92,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 105,
          "canBe": [
            "modelvalidation/simulation/emodelscript/v0.1.0"
          ],
          "simpleAttributeName": "mainModelScript",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/mainModelScript",
          "label": "Main model script"
        },
        {
          "numOfOccurences": 16,
          "simpleAttributeName": "parameters",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/parameters",
          "label": "Parameters"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "generatedAtTime",
          "attribute": "https://schema.hbp.eu/modelvalidation/simulation/modelinstance/v0.1.1/generatedAtTime",
          "label": "Generated at time"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 105,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "modelvalidation/simulation/modelvalidation/v0.2.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        },
        {
          "simplePropertyName": "hasPart",
          "canBe": [
            "modelvalidation/simulation/modelproject/v0.1.0"
          ],
          "attribute": "http://purl.org/dc/terms/hasPart",
          "label": "Has part",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/license/v1.0.0",
      "group": "uniminds",
      "label": "License",
      "properties": [
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "url",
          "attribute": "http://schema.org/url",
          "label": "Url"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "fullName",
          "attribute": "https://schema.hbp.eu/uniminds/fullName",
          "label": "Full name"
        },
        {
          "simplePropertyName": "license",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/license",
          "label": "License",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/cell/v1.0.0",
      "group": "ontologies",
      "label": "Cell",
      "properties": [
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 127,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "acronym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "bamsID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bamsID",
          "label": "Bams id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "bonfireID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bonfireID",
          "label": "Bonfire id"
        },
        {
          "numOfOccurences": 33,
          "simpleAttributeName": "cell_ontology_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/cell_ontology_ID",
          "label": "Cell ontology id"
        },
        {
          "numOfOccurences": 270,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 81,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "definingCitationID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationID",
          "label": "Defining citation id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "externallySourcedDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externallySourcedDefinition",
          "label": "Externally sourced definition"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "gene_Ontology_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gene_Ontology_ID",
          "label": "Gene ontology id"
        },
        {
          "numOfOccurences": 111,
          "simpleAttributeName": "hasExternalSource",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/hasExternalSource",
          "label": "Has external source"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "hasFormerParentClass",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/hasFormerParentClass",
          "label": "Has former parent class"
        },
        {
          "numOfOccurences": 191,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "pendingActionNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/pendingActionNote",
          "label": "Pending action note"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "PMID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/PMID",
          "label": "Pmid"
        },
        {
          "numOfOccurences": 93,
          "simpleAttributeName": "sao_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/sao_ID",
          "label": "Sao id"
        },
        {
          "numOfOccurences": 259,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "tempDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/tempDefinition",
          "label": "Temp definition"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "umls_ID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/umls_ID",
          "label": "Umls id"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 481,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 23,
          "simpleAttributeName": "versionInfo",
          "attribute": "http://www.w3.org/2002/07/owl#versionInfo",
          "label": "Version info"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "altLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#altLabel",
          "label": "Alt label"
        },
        {
          "numOfOccurences": 19,
          "simpleAttributeName": "changeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#changeNote",
          "label": "Change note"
        },
        {
          "numOfOccurences": 227,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "example",
          "attribute": "http://www.w3.org/2004/02/skos/core#example",
          "label": "Example"
        },
        {
          "numOfOccurences": 237,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "scopeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#scopeNote",
          "label": "Scope note"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 127,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "acronym",
          "attribute": "https://schema.hbp.eu/ontologies/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 227,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 481,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 481,
          "canBe": [
            "ontologies/core/cell/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 259,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/cell/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/fileassociation/v0.0.4",
      "group": "minds",
      "label": "Fileassociation",
      "properties": [
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "associated_entity",
          "attribute": "http://hbp.eu/minds#associated_entity",
          "label": "Associated entity"
        },
        {
          "numOfOccurences": 1308,
          "canBe": [
            "minds/core/file/v0.0.4"
          ],
          "simpleAttributeName": "file",
          "attribute": "http://hbp.eu/minds#file",
          "label": "File"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1308,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "uniminds/core/ethicsapproval/v1.0.0",
      "group": "uniminds",
      "label": "Ethicsapproval",
      "properties": [
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 15,
          "canBe": [
            "minds/ethics/approval/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "uniminds/options/country/v1.0.0"
          ],
          "simpleAttributeName": "countryOfOrigin",
          "attribute": "https://schema.hbp.eu/uniminds/countryOfOrigin",
          "label": "Country of origin"
        },
        {
          "numOfOccurences": 20,
          "canBe": [
            "uniminds/options/ethicsauthority/v1.0.0"
          ],
          "simpleAttributeName": "ethicsAuthority",
          "attribute": "https://schema.hbp.eu/uniminds/ethicsAuthority",
          "label": "Ethics authority"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "hbpEthicsApproval",
          "attribute": "https://schema.hbp.eu/uniminds/hbpEthicsApproval",
          "label": "Hbp ethics approval"
        },
        {
          "simplePropertyName": "ethicsApproval",
          "canBe": [
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/method/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/ethicsApproval",
          "label": "Ethics approval",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/core/organization/v0.1.0",
      "group": "modelvalidation",
      "label": "Organization",
      "properties": [
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "address",
          "attribute": "http://schema.org/address",
          "label": "Address"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "organization",
          "canBe": [
            "modelvalidation/simulation/modelproject/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/organization",
          "label": "Organization",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/modelproject/v0.1.0",
      "group": "modelvalidation",
      "label": "Modelproject",
      "properties": [
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 343,
          "canBe": [
            "modelvalidation/simulation/memodel/v0.1.2",
            "modelvalidation/simulation/modelinstance/v0.1.1"
          ],
          "simpleAttributeName": "hasPart",
          "attribute": "http://purl.org/dc/terms/hasPart",
          "label": "Has part"
        },
        {
          "numOfOccurences": 343,
          "canBe": [
            "modelvalidation/core/person/v0.1.0"
          ],
          "simpleAttributeName": "author",
          "attribute": "http://schema.org/author",
          "label": "Author"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "dateCreated",
          "attribute": "http://schema.org/dateCreated",
          "label": "Date created"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 110,
          "simpleAttributeName": "abstractionLevel",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/abstractionLevel",
          "label": "Abstraction level"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "alias",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/alias",
          "label": "Alias"
        },
        {
          "numOfOccurences": 322,
          "simpleAttributeName": "brainRegion",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/brainRegion",
          "label": "Brain region"
        },
        {
          "numOfOccurences": 300,
          "simpleAttributeName": "celltype",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/celltype",
          "label": "Celltype"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "collabID",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/collabID",
          "label": "Collab id"
        },
        {
          "numOfOccurences": 329,
          "simpleAttributeName": "modelOf",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/modelOf",
          "label": "Model of"
        },
        {
          "numOfOccurences": 297,
          "canBe": [
            "modelvalidation/core/organization/v0.1.0"
          ],
          "simpleAttributeName": "organization",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/organization",
          "label": "Organization"
        },
        {
          "numOfOccurences": 343,
          "canBe": [
            "modelvalidation/core/person/v0.1.0"
          ],
          "simpleAttributeName": "owner",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/owner",
          "label": "Owner"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "private",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/private",
          "label": "Private"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 305,
          "simpleAttributeName": "species",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/species",
          "label": "Species"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "images",
          "attribute": "https://schema.hbp.eu/modelvalidation/simulation/modelproject/v0.1.0/images",
          "label": "Images"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 343,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "ontologies/core/anatomicalentity/v1.0.0",
      "group": "ontologies",
      "label": "Anatomicalentity",
      "properties": [
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 2127,
          "simpleAttributeName": "provenance_notes",
          "attribute": "http://purl.obolibrary.org/obo/core#provenance_notes",
          "label": "Provenance notes"
        },
        {
          "numOfOccurences": 30,
          "simpleAttributeName": "somite_number",
          "attribute": "http://purl.obolibrary.org/obo/core#somite_number",
          "label": "Somite number"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "tooth_number",
          "attribute": "http://purl.obolibrary.org/obo/core#tooth_number",
          "label": "Tooth number"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "vertebra_number",
          "attribute": "http://purl.obolibrary.org/obo/core#vertebra_number",
          "label": "Vertebra number"
        },
        {
          "numOfOccurences": 11049,
          "simpleAttributeName": "IAO_0000115",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000115",
          "label": "Iao 0000115"
        },
        {
          "numOfOccurences": 870,
          "simpleAttributeName": "IAO_0000116",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000116",
          "label": "Iao 0000116"
        },
        {
          "numOfOccurences": 231,
          "simpleAttributeName": "IAO_0000232",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0000232",
          "label": "Iao 0000232"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "IAO_0100001",
          "attribute": "http://purl.obolibrary.org/obo/IAO_0100001",
          "label": "Iao 0100001"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "ABBREVIATION",
          "attribute": "http://purl.obolibrary.org/obo/uberon/core#ABBREVIATION",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "EXACT_PREFERRED",
          "attribute": "http://purl.obolibrary.org/obo/uberon/core#EXACT_PREFERRED",
          "label": "Exact preferred"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "LATIN",
          "attribute": "http://purl.obolibrary.org/obo/uberon/core#LATIN",
          "label": "Latin"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "RLATED",
          "attribute": "http://purl.obolibrary.org/obo/uberon/core#RLATED",
          "label": "Rlated"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "taxon_notes",
          "attribute": "http://purl.obolibrary.org/obo/uberon/insect-anatomy#taxon_notes",
          "label": "Taxon notes"
        },
        {
          "numOfOccurences": 1257,
          "simpleAttributeName": "UBPROP_0000001",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000001",
          "label": "Ubprop 0000001"
        },
        {
          "numOfOccurences": 124,
          "simpleAttributeName": "UBPROP_0000002",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000002",
          "label": "Ubprop 0000002"
        },
        {
          "numOfOccurences": 619,
          "simpleAttributeName": "UBPROP_0000003",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000003",
          "label": "Ubprop 0000003"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "UBPROP_0000005",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000005",
          "label": "Ubprop 0000005"
        },
        {
          "numOfOccurences": 79,
          "simpleAttributeName": "UBPROP_0000006",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000006",
          "label": "Ubprop 0000006"
        },
        {
          "numOfOccurences": 284,
          "simpleAttributeName": "UBPROP_0000007",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000007",
          "label": "Ubprop 0000007"
        },
        {
          "numOfOccurences": 695,
          "simpleAttributeName": "UBPROP_0000008",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000008",
          "label": "Ubprop 0000008"
        },
        {
          "numOfOccurences": 146,
          "simpleAttributeName": "UBPROP_0000009",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000009",
          "label": "Ubprop 0000009"
        },
        {
          "numOfOccurences": 114,
          "simpleAttributeName": "UBPROP_0000010",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000010",
          "label": "Ubprop 0000010"
        },
        {
          "numOfOccurences": 150,
          "simpleAttributeName": "UBPROP_0000011",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000011",
          "label": "Ubprop 0000011"
        },
        {
          "numOfOccurences": 619,
          "simpleAttributeName": "UBPROP_0000012",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000012",
          "label": "Ubprop 0000012"
        },
        {
          "numOfOccurences": 66,
          "simpleAttributeName": "UBPROP_0000013",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000013",
          "label": "Ubprop 0000013"
        },
        {
          "numOfOccurences": 14,
          "simpleAttributeName": "UBPROP_0000014",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000014",
          "label": "Ubprop 0000014"
        },
        {
          "numOfOccurences": 13,
          "simpleAttributeName": "UBPROP_0000015",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000015",
          "label": "Ubprop 0000015"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "UBPROP_0000103",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000103",
          "label": "Ubprop 0000103"
        },
        {
          "numOfOccurences": 24,
          "simpleAttributeName": "UBPROP_0000104",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000104",
          "label": "Ubprop 0000104"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "UBPROP_0000105",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000105",
          "label": "Ubprop 0000105"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "UBPROP_0000106",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000106",
          "label": "Ubprop 0000106"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "UBPROP_0000107",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000107",
          "label": "Ubprop 0000107"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "UBPROP_0000111",
          "attribute": "http://purl.obolibrary.org/obo/UBPROP_0000111",
          "label": "Ubprop 0000111"
        },
        {
          "numOfOccurences": 121,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "description",
          "attribute": "http://purl.org/dc/elements/1.1/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "source",
          "attribute": "http://purl.org/dc/elements/1.1/source",
          "label": "Source"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 464,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "acronym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "altDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/altDefinition",
          "label": "Alt definition"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "atccID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/atccID",
          "label": "Atcc id"
        },
        {
          "numOfOccurences": 87,
          "simpleAttributeName": "bamsID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bamsID",
          "label": "Bams id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "birnlexComment",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexComment",
          "label": "Birnlex comment"
        },
        {
          "numOfOccurences": 114,
          "simpleAttributeName": "birnlexDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexDefinition",
          "label": "Birnlex definition"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "birnlexPendingDifferentiaNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexPendingDifferentiaNote",
          "label": "Birnlex pending differentia note"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "birnlexRetiredDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexRetiredDefinition",
          "label": "Birnlex retired definition"
        },
        {
          "numOfOccurences": 20,
          "simpleAttributeName": "bonfireID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bonfireID",
          "label": "Bonfire id"
        },
        {
          "numOfOccurences": 1585,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 68,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 143,
          "simpleAttributeName": "externallySourcedDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externallySourcedDefinition",
          "label": "Externally sourced definition"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "hasExternalSource",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/hasExternalSource",
          "label": "Has external source"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "MeshUid",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/MeshUid",
          "label": "Mesh uid"
        },
        {
          "numOfOccurences": 1436,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 57,
          "simpleAttributeName": "neuroNamesAncillaryTerm",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/neuroNamesAncillaryTerm",
          "label": "Neuro names ancillary term"
        },
        {
          "numOfOccurences": 651,
          "simpleAttributeName": "neuronamesID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/neuronamesID",
          "label": "Neuronames id"
        },
        {
          "numOfOccurences": 44,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 25,
          "simpleAttributeName": "pendingActionNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/pendingActionNote",
          "label": "Pending action note"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "pendingMereotopologicalRelationNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/pendingMereotopologicalRelationNote",
          "label": "Pending mereotopological relation note"
        },
        {
          "numOfOccurences": 617,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "tempDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/tempDefinition",
          "label": "Temp definition"
        },
        {
          "numOfOccurences": 793,
          "simpleAttributeName": "UmlsCui",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/UmlsCui",
          "label": "Umls cui"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "usageNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/usageNote",
          "label": "Usage note"
        },
        {
          "numOfOccurences": 54,
          "simpleAttributeName": "consider",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#consider",
          "label": "Consider"
        },
        {
          "numOfOccurences": 2432,
          "simpleAttributeName": "created_by",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#created_by",
          "label": "Created by"
        },
        {
          "numOfOccurences": 27,
          "simpleAttributeName": "creation_date",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#creation_date",
          "label": "Creation date"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "editor_note",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#editor_note",
          "label": "Editor note"
        },
        {
          "numOfOccurences": 309,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 1052,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 10101,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 7755,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 449,
          "simpleAttributeName": "hasNarrowSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym",
          "label": "Has narrow synonym"
        },
        {
          "numOfOccurences": 13259,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 4886,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hasVersion",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasVersion",
          "label": "Has version"
        },
        {
          "numOfOccurences": 10978,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1056,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 15263,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 24,
          "simpleAttributeName": "seeAlso",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#seeAlso",
          "label": "See also"
        },
        {
          "numOfOccurences": 1784,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 125,
          "simpleAttributeName": "versionInfo",
          "attribute": "http://www.w3.org/2002/07/owl#versionInfo",
          "label": "Version info"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "changeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#changeNote",
          "label": "Change note"
        },
        {
          "numOfOccurences": 218,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 108,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "example",
          "attribute": "http://www.w3.org/2004/02/skos/core#example",
          "label": "Example"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "historyNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#historyNote",
          "label": "History note"
        },
        {
          "numOfOccurences": 1416,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 68,
          "simpleAttributeName": "scopeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#scopeNote",
          "label": "Scope note"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 464,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "acronym",
          "attribute": "https://schema.hbp.eu/ontologies/acronym",
          "label": "Acronym"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 11257,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 15263,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 15359,
          "canBe": [
            "ontologies/core/anatomicalentity/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 10150,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 15360,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/anatomicalentity/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/validationscript/v0.1.0",
      "group": "modelvalidation",
      "label": "Validationscript",
      "properties": [
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "codeRepository",
          "attribute": "http://schema.org/codeRepository",
          "label": "Code repository"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "dateCreated",
          "attribute": "http://schema.org/dateCreated",
          "label": "Date created"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "version",
          "attribute": "http://schema.org/version",
          "label": "Version"
        },
        {
          "numOfOccurences": 41,
          "canBe": [
            "modelvalidation/simulation/validationtestdefinition/v0.1.0"
          ],
          "simpleAttributeName": "implements",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/implements",
          "label": "Implements"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "parameters",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/parameters",
          "label": "Parameters"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "path",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/path",
          "label": "Path"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 41,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "modelvalidation/simulation/modelvalidation/v0.2.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/metazoa/v1.0.0",
      "group": "ontologies",
      "label": "Metazoa",
      "properties": [
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "animalModel",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/animalModel",
          "label": "Animal model"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "antiquated",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/antiquated",
          "label": "Antiquated"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "birnlexDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexDefinition",
          "label": "Birnlex definition"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "bonfireID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bonfireID",
          "label": "Bonfire id"
        },
        {
          "numOfOccurences": 648,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 34,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "definingCitationID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationID",
          "label": "Defining citation id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "definingCitationURI",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationURI",
          "label": "Defining citation uri"
        },
        {
          "numOfOccurences": 80,
          "simpleAttributeName": "externallySourcedDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externallySourcedDefinition",
          "label": "Externally sourced definition"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 374,
          "simpleAttributeName": "gbifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifID",
          "label": "Gbif id"
        },
        {
          "numOfOccurences": 285,
          "simpleAttributeName": "gbifTaxonKeyID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifTaxonKeyID",
          "label": "Gbif taxon key id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "imsrStandardStrainName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/imsrStandardStrainName",
          "label": "Imsr standard strain name"
        },
        {
          "numOfOccurences": 64,
          "simpleAttributeName": "itisID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/itisID",
          "label": "Itis id"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "jaxMiceID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/jaxMiceID",
          "label": "Jax mice id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "misnomer",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/misnomer",
          "label": "Misnomer"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "misspelling",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/misspelling",
          "label": "Misspelling"
        },
        {
          "numOfOccurences": 621,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "ncbiIncludesName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiIncludesName",
          "label": "Ncbi includes name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "ncbiInPartName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiInPartName",
          "label": "Ncbi in part name"
        },
        {
          "numOfOccurences": 23,
          "simpleAttributeName": "ncbiTaxBlastName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxBlastName",
          "label": "Ncbi tax blast name"
        },
        {
          "numOfOccurences": 170,
          "simpleAttributeName": "ncbiTaxGenbankCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxGenbankCommonName",
          "label": "Ncbi tax genbank common name"
        },
        {
          "numOfOccurences": 540,
          "simpleAttributeName": "ncbiTaxID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxID",
          "label": "Ncbi tax id"
        },
        {
          "numOfOccurences": 482,
          "simpleAttributeName": "ncbiTaxScientificName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxScientificName",
          "label": "Ncbi tax scientific name"
        },
        {
          "numOfOccurences": 42,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "PMID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/PMID",
          "label": "Pmid"
        },
        {
          "numOfOccurences": 98,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 112,
          "simpleAttributeName": "taxonomicCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/taxonomicCommonName",
          "label": "Taxonomic common name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "tempDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/tempDefinition",
          "label": "Temp definition"
        },
        {
          "numOfOccurences": 513,
          "simpleAttributeName": "UmlsCui",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/UmlsCui",
          "label": "Umls cui"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "usageNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/usageNote",
          "label": "Usage note"
        },
        {
          "numOfOccurences": 445,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 3905,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 1752,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 3905,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 1100,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 3905,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 4630,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "versionInfo",
          "attribute": "http://www.w3.org/2002/07/owl#versionInfo",
          "label": "Version info"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "changeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#changeNote",
          "label": "Change note"
        },
        {
          "numOfOccurences": 27,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 129,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "example",
          "attribute": "http://www.w3.org/2004/02/skos/core#example",
          "label": "Example"
        },
        {
          "numOfOccurences": 637,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "scopeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#scopeNote",
          "label": "Scope note"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 102,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 27,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4630,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 4630,
          "canBe": [
            "ontologies/core/metazoa/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 2182,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4631,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/metazoa/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/validationresult/v0.1.0",
      "group": "modelvalidation",
      "label": "Validationresult",
      "properties": [
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "dateCreated",
          "attribute": "http://schema.org/dateCreated",
          "label": "Date created"
        },
        {
          "numOfOccurences": 1284,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1550,
          "canBe": [
            "modelvalidation/simulation/analysisresult/v1.0.0"
          ],
          "simpleAttributeName": "hadMember",
          "attribute": "http://www.w3.org/ns/prov#hadMember",
          "label": "Had member"
        },
        {
          "numOfOccurences": 1540,
          "canBe": [
            "modelvalidation/simulation/modelvalidation/v0.2.0"
          ],
          "simpleAttributeName": "wasGeneratedBy",
          "attribute": "http://www.w3.org/ns/prov#wasGeneratedBy",
          "label": "Was generated by"
        },
        {
          "numOfOccurences": 35,
          "simpleAttributeName": "collabID",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/collabID",
          "label": "Collab id"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "normalizedScore",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/normalizedScore",
          "label": "Normalized score"
        },
        {
          "numOfOccurences": 1284,
          "simpleAttributeName": "providerId",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/providerId",
          "label": "Provider id"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "score",
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/score",
          "label": "Score"
        },
        {
          "numOfOccurences": 199,
          "simpleAttributeName": "passedValidation",
          "attribute": "https://schema.hbp.eu/modelvalidation/simulation/validationresult/v0.1.0/passedValidation",
          "label": "Passed validation"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1550,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "generated",
          "canBe": [
            "modelvalidation/simulation/modelvalidation/v0.2.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#generated",
          "label": "Generated",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/strain/v1.0.0",
      "group": "uniminds",
      "label": "Strain",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "strain",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/strain",
          "label": "Strain",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/organism/v1.0.0",
      "group": "ontologies",
      "label": "Organism",
      "properties": [
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 21,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "animalModel",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/animalModel",
          "label": "Animal model"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "antiquated",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/antiquated",
          "label": "Antiquated"
        },
        {
          "numOfOccurences": 15,
          "simpleAttributeName": "birnlexDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexDefinition",
          "label": "Birnlex definition"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "bonfireID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bonfireID",
          "label": "Bonfire id"
        },
        {
          "numOfOccurences": 670,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 29,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 27,
          "simpleAttributeName": "definingCitationID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationID",
          "label": "Defining citation id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "definingCitationURI",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationURI",
          "label": "Defining citation uri"
        },
        {
          "numOfOccurences": 75,
          "simpleAttributeName": "externallySourcedDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externallySourcedDefinition",
          "label": "Externally sourced definition"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 386,
          "simpleAttributeName": "gbifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifID",
          "label": "Gbif id"
        },
        {
          "numOfOccurences": 283,
          "simpleAttributeName": "gbifTaxonKeyID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifTaxonKeyID",
          "label": "Gbif taxon key id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "imsrStandardStrainName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/imsrStandardStrainName",
          "label": "Imsr standard strain name"
        },
        {
          "numOfOccurences": 64,
          "simpleAttributeName": "itisID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/itisID",
          "label": "Itis id"
        },
        {
          "numOfOccurences": 20,
          "simpleAttributeName": "jaxMiceID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/jaxMiceID",
          "label": "Jax mice id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "misnomer",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/misnomer",
          "label": "Misnomer"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "misspelling",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/misspelling",
          "label": "Misspelling"
        },
        {
          "numOfOccurences": 640,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "ncbiIncludesName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiIncludesName",
          "label": "Ncbi includes name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "ncbiInPartName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiInPartName",
          "label": "Ncbi in part name"
        },
        {
          "numOfOccurences": 23,
          "simpleAttributeName": "ncbiTaxBlastName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxBlastName",
          "label": "Ncbi tax blast name"
        },
        {
          "numOfOccurences": 171,
          "simpleAttributeName": "ncbiTaxGenbankCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxGenbankCommonName",
          "label": "Ncbi tax genbank common name"
        },
        {
          "numOfOccurences": 565,
          "simpleAttributeName": "ncbiTaxID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxID",
          "label": "Ncbi tax id"
        },
        {
          "numOfOccurences": 508,
          "simpleAttributeName": "ncbiTaxScientificName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxScientificName",
          "label": "Ncbi tax scientific name"
        },
        {
          "numOfOccurences": 40,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "pendingActionNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/pendingActionNote",
          "label": "Pending action note"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "PMID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/PMID",
          "label": "Pmid"
        },
        {
          "numOfOccurences": 103,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 112,
          "simpleAttributeName": "taxonomicCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/taxonomicCommonName",
          "label": "Taxonomic common name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "tempDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/tempDefinition",
          "label": "Temp definition"
        },
        {
          "numOfOccurences": 540,
          "simpleAttributeName": "UmlsCui",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/UmlsCui",
          "label": "Umls cui"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "usageNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/usageNote",
          "label": "Usage note"
        },
        {
          "numOfOccurences": 397,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hasBroadSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym",
          "label": "Has broad synonym"
        },
        {
          "numOfOccurences": 3461,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 1599,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 3461,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 956,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 3461,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 4207,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "versionInfo",
          "attribute": "http://www.w3.org/2002/07/owl#versionInfo",
          "label": "Version info"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "altLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#altLabel",
          "label": "Alt label"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "changeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#changeNote",
          "label": "Change note"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 129,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "example",
          "attribute": "http://www.w3.org/2004/02/skos/core#example",
          "label": "Example"
        },
        {
          "numOfOccurences": 657,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "scopeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#scopeNote",
          "label": "Scope note"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 90,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4207,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 4208,
          "canBe": [
            "ontologies/core/organism/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 1982,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4209,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "alternateOf",
          "canBe": [
            "minds/core/species/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#alternateOf",
          "label": "Alternate of",
          "reverse": true
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/organism/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/experimentalpreparation/v1.0.0",
      "group": "uniminds",
      "label": "Experimentalpreparation",
      "properties": [
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 5,
          "canBe": [
            "minds/core/preparation/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "experimentalPreparation",
          "canBe": [
            "uniminds/core/method/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/experimentalPreparation",
          "label": "Experimental preparation",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/publication/v1.0.0",
      "group": "uniminds",
      "label": "Publication",
      "properties": [
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "url",
          "attribute": "http://schema.org/url",
          "label": "Url"
        },
        {
          "numOfOccurences": 79,
          "canBe": [
            "minds/core/publication/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 18,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "uniminds/options/brainstructure/v1.0.0"
          ],
          "simpleAttributeName": "brainStructure",
          "attribute": "https://schema.hbp.eu/uniminds/brainStructure",
          "label": "Brain structure"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/core/project/v1.0.0"
          ],
          "simpleAttributeName": "project",
          "attribute": "https://schema.hbp.eu/uniminds/project",
          "label": "Project"
        },
        {
          "numOfOccurences": 82,
          "canBe": [
            "uniminds/options/publicationid/v1.0.0"
          ],
          "simpleAttributeName": "publicationId",
          "attribute": "https://schema.hbp.eu/uniminds/publicationId",
          "label": "Publication id"
        },
        {
          "numOfOccurences": 3,
          "canBe": [
            "uniminds/core/studytarget/v1.0.0"
          ],
          "simpleAttributeName": "studyTarget",
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "uniminds/core/subjectgroup/v1.0.0"
          ],
          "simpleAttributeName": "subjectGroup",
          "attribute": "https://schema.hbp.eu/uniminds/subjectGroup",
          "label": "Subject group"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "publication",
          "canBe": [
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/modelinstance/v1.0.0",
            "uniminds/core/method/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0",
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/subject/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/publication",
          "label": "Publication",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/modelvalidation/v0.2.0",
      "group": "modelvalidation",
      "label": "Modelvalidation",
      "properties": [
        {
          "numOfOccurences": 1540,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1540,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1540,
          "canBe": [
            "modelvalidation/simulation/validationresult/v0.1.0"
          ],
          "simpleAttributeName": "generated",
          "attribute": "http://www.w3.org/ns/prov#generated",
          "label": "Generated"
        },
        {
          "numOfOccurences": 1540,
          "simpleAttributeName": "startedAtTime",
          "attribute": "http://www.w3.org/ns/prov#startedAtTime",
          "label": "Started at time"
        },
        {
          "numOfOccurences": 1540,
          "canBe": [
            "modelvalidation/simulation/memodel/v0.1.2",
            "modelvalidation/core/collection/v0.1.0",
            "modelvalidation/simulation/validationscript/v0.1.0",
            "modelvalidation/simulation/modelinstance/v0.1.1"
          ],
          "simpleAttributeName": "used",
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used"
        },
        {
          "numOfOccurences": 1540,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 1540,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 1540,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "wasGeneratedBy",
          "canBe": [
            "modelvalidation/simulation/validationresult/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasGeneratedBy",
          "label": "Was generated by",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/preparation/v1.0.0",
      "group": "minds",
      "label": "Preparation",
      "properties": [
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 5,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/options/experimentalpreparation/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        },
        {
          "simplePropertyName": "preparation",
          "canBe": [
            "minds/core/activity/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/minds/preparation",
          "label": "Preparation",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/options/embargostatus/v1.0.0",
      "group": "uniminds",
      "label": "Embargostatus",
      "properties": [
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 2,
          "canBe": [
            "minds/core/embargostatus/v1.0.0"
          ],
          "simpleAttributeName": "wasDerivedFrom",
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "embargoStatus",
          "canBe": [
            "uniminds/core/dataset/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/embargoStatus",
          "label": "Embargo status",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/core/collection/v0.1.0",
      "group": "modelvalidation",
      "label": "Collection",
      "properties": [
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "size",
          "attribute": "http://schema.org/size",
          "label": "Size"
        },
        {
          "numOfOccurences": 26,
          "canBe": [
            "modelvalidation/simulation/analysisresult/v1.0.0"
          ],
          "simpleAttributeName": "hadMember",
          "attribute": "http://www.w3.org/ns/prov#hadMember",
          "label": "Had member"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 26,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "used",
          "canBe": [
            "modelvalidation/simulation/modelvalidation/v0.2.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#used",
          "label": "Used",
          "reverse": true
        }
      ]
    },
    {
      "id": "ontologies/core/vertebratametazoa/v1.0.0",
      "group": "ontologies",
      "label": "Vertebratametazoa",
      "properties": [
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "contributor",
          "attribute": "http://purl.org/dc/elements/1.1/contributor",
          "label": "Contributor"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "abbrev",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/abbrev",
          "label": "Abbrev"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "animalModel",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/animalModel",
          "label": "Animal model"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "antiquated",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/antiquated",
          "label": "Antiquated"
        },
        {
          "numOfOccurences": 17,
          "simpleAttributeName": "birnlexDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/birnlexDefinition",
          "label": "Birnlex definition"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "bonfireID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/bonfireID",
          "label": "Bonfire id"
        },
        {
          "numOfOccurences": 359,
          "simpleAttributeName": "createdDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/createdDate",
          "label": "Created date"
        },
        {
          "numOfOccurences": 22,
          "simpleAttributeName": "definingCitation",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitation",
          "label": "Defining citation"
        },
        {
          "numOfOccurences": 32,
          "simpleAttributeName": "definingCitationID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationID",
          "label": "Defining citation id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "definingCitationURI",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/definingCitationURI",
          "label": "Defining citation uri"
        },
        {
          "numOfOccurences": 63,
          "simpleAttributeName": "externallySourcedDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externallySourcedDefinition",
          "label": "Externally sourced definition"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "externalSourceId",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/externalSourceId",
          "label": "External source id"
        },
        {
          "numOfOccurences": 184,
          "simpleAttributeName": "gbifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifID",
          "label": "Gbif id"
        },
        {
          "numOfOccurences": 169,
          "simpleAttributeName": "gbifTaxonKeyID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/gbifTaxonKeyID",
          "label": "Gbif taxon key id"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "imsrStandardStrainName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/imsrStandardStrainName",
          "label": "Imsr standard strain name"
        },
        {
          "numOfOccurences": 9,
          "simpleAttributeName": "itisID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/itisID",
          "label": "Itis id"
        },
        {
          "numOfOccurences": 28,
          "simpleAttributeName": "jaxMiceID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/jaxMiceID",
          "label": "Jax mice id"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "misnomer",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/misnomer",
          "label": "Misnomer"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "misspelling",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/misspelling",
          "label": "Misspelling"
        },
        {
          "numOfOccurences": 345,
          "simpleAttributeName": "modifiedDate",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/modifiedDate",
          "label": "Modified date"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "ncbiIncludesName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiIncludesName",
          "label": "Ncbi includes name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "ncbiInPartName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiInPartName",
          "label": "Ncbi in part name"
        },
        {
          "numOfOccurences": 8,
          "simpleAttributeName": "ncbiTaxBlastName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxBlastName",
          "label": "Ncbi tax blast name"
        },
        {
          "numOfOccurences": 99,
          "simpleAttributeName": "ncbiTaxGenbankCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxGenbankCommonName",
          "label": "Ncbi tax genbank common name"
        },
        {
          "numOfOccurences": 273,
          "simpleAttributeName": "ncbiTaxID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxID",
          "label": "Ncbi tax id"
        },
        {
          "numOfOccurences": 279,
          "simpleAttributeName": "ncbiTaxScientificName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/ncbiTaxScientificName",
          "label": "Ncbi tax scientific name"
        },
        {
          "numOfOccurences": 24,
          "simpleAttributeName": "nifID",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/nifID",
          "label": "Nif id"
        },
        {
          "numOfOccurences": 65,
          "simpleAttributeName": "synonym",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 90,
          "simpleAttributeName": "taxonomicCommonName",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/taxonomicCommonName",
          "label": "Taxonomic common name"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "tempDefinition",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/tempDefinition",
          "label": "Temp definition"
        },
        {
          "numOfOccurences": 259,
          "simpleAttributeName": "UmlsCui",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/UmlsCui",
          "label": "Umls cui"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "usageNote",
          "attribute": "http://uri.neuinfo.org/nif/nifstd/readable/usageNote",
          "label": "Usage note"
        },
        {
          "numOfOccurences": 306,
          "simpleAttributeName": "hasAlternativeId",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasAlternativeId",
          "label": "Has alternative id"
        },
        {
          "numOfOccurences": 2411,
          "simpleAttributeName": "hasDbXref",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasDbXref",
          "label": "Has db xref"
        },
        {
          "numOfOccurences": 1313,
          "simpleAttributeName": "hasExactSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasExactSynonym",
          "label": "Has exact synonym"
        },
        {
          "numOfOccurences": 2411,
          "simpleAttributeName": "hasOBONamespace",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasOBONamespace",
          "label": "Has obo namespace"
        },
        {
          "numOfOccurences": 769,
          "simpleAttributeName": "hasRelatedSynonym",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym",
          "label": "Has related synonym"
        },
        {
          "numOfOccurences": 2411,
          "simpleAttributeName": "id",
          "attribute": "http://www.geneontology.org/formats/oboInOwl#id",
          "label": "Id"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "comment",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#comment",
          "label": "Comment"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "label",
          "attribute": "http://www.w3.org/2000/01/rdf-schema#label",
          "label": "Label"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "deprecated",
          "attribute": "http://www.w3.org/2002/07/owl#deprecated",
          "label": "Deprecated"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "versionInfo",
          "attribute": "http://www.w3.org/2002/07/owl#versionInfo",
          "label": "Version info"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "changeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#changeNote",
          "label": "Change note"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "definition",
          "attribute": "http://www.w3.org/2004/02/skos/core#definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 113,
          "simpleAttributeName": "editorialNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#editorialNote",
          "label": "Editorial note"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "example",
          "attribute": "http://www.w3.org/2004/02/skos/core#example",
          "label": "Example"
        },
        {
          "numOfOccurences": 349,
          "simpleAttributeName": "prefLabel",
          "attribute": "http://www.w3.org/2004/02/skos/core#prefLabel",
          "label": "Pref label"
        },
        {
          "numOfOccurences": 6,
          "simpleAttributeName": "scopeNote",
          "attribute": "http://www.w3.org/2004/02/skos/core#scopeNote",
          "label": "Scope note"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "hashcode",
          "attribute": "https://schema.hbp.eu/internal/hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "abbreviation",
          "attribute": "https://schema.hbp.eu/ontologies/abbreviation",
          "label": "Abbreviation"
        },
        {
          "numOfOccurences": 101,
          "simpleAttributeName": "category",
          "attribute": "https://schema.hbp.eu/ontologies/category",
          "label": "Category"
        },
        {
          "numOfOccurences": 10,
          "simpleAttributeName": "definition",
          "attribute": "https://schema.hbp.eu/ontologies/definition",
          "label": "Definition"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "id",
          "attribute": "https://schema.hbp.eu/ontologies/id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "lbl",
          "attribute": "https://schema.hbp.eu/ontologies/lbl",
          "label": "Lbl"
        },
        {
          "numOfOccurences": 2784,
          "canBe": [
            "ontologies/core/vertebratametazoa/v1.0.0"
          ],
          "simpleAttributeName": "subclassof",
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof"
        },
        {
          "numOfOccurences": 1556,
          "simpleAttributeName": "synonym",
          "attribute": "https://schema.hbp.eu/ontologies/synonym",
          "label": "Synonym"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "types",
          "attribute": "https://schema.hbp.eu/ontologies/types",
          "label": "Types"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2785,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "subclassof",
          "canBe": [
            "ontologies/core/vertebratametazoa/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/ontologies/subclassof",
          "label": "Subclassof",
          "reverse": true
        }
      ]
    },
    {
      "id": "uniminds/core/studytarget/v1.0.0",
      "group": "uniminds",
      "label": "Studytarget",
      "properties": [
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 96,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 7,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 97,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "numOfOccurences": 88,
          "simpleAttributeName": "fullName",
          "attribute": "https://schema.hbp.eu/uniminds/fullName",
          "label": "Full name"
        },
        {
          "numOfOccurences": 86,
          "canBe": [
            "uniminds/options/studytargetsource/v1.0.0"
          ],
          "simpleAttributeName": "studyTargetSource",
          "attribute": "https://schema.hbp.eu/uniminds/studyTargetSource",
          "label": "Study target source"
        },
        {
          "numOfOccurences": 89,
          "canBe": [
            "uniminds/options/studytargettype/v1.0.0"
          ],
          "simpleAttributeName": "studyTargetType",
          "attribute": "https://schema.hbp.eu/uniminds/studyTargetType",
          "label": "Study target type"
        },
        {
          "simplePropertyName": "studyTarget",
          "canBe": [
            "uniminds/core/subject/v1.0.0",
            "uniminds/core/dataset/v1.0.0",
            "uniminds/core/method/v1.0.0",
            "uniminds/core/subjectgroup/v1.0.0",
            "uniminds/core/publication/v1.0.0",
            "uniminds/core/filebundle/v1.0.0",
            "uniminds/core/file/v1.0.0",
            "uniminds/core/modelinstance/v1.0.0"
          ],
          "attribute": "https://schema.hbp.eu/uniminds/studyTarget",
          "label": "Study target",
          "reverse": true
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/software/software/v1.0.0",
      "group": "softwarecatalog",
      "label": "Software",
      "properties": [
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/options/applicationcategory/v1.0.0"
          ],
          "simpleAttributeName": "applicationCategory",
          "attribute": "http://schema.org/applicationCategory",
          "label": "Application category"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "citation",
          "attribute": "http://schema.org/citation",
          "label": "Citation"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "description",
          "attribute": "http://schema.org/description",
          "label": "Description"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/options/device/v1.0.0"
          ],
          "simpleAttributeName": "device",
          "attribute": "http://schema.org/device",
          "label": "Device"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "documentation",
          "attribute": "http://schema.org/documentation",
          "label": "Documentation"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/software/softwarefeature/v1.0.0"
          ],
          "simpleAttributeName": "feature",
          "attribute": "http://schema.org/feature",
          "label": "Feature"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "headline",
          "attribute": "http://schema.org/headline",
          "label": "Headline"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "isAccessibleForFree",
          "attribute": "http://schema.org/isAccessibleForFree",
          "label": "Is accessible for free"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "canBe": [
            "softwarecatalog/options/operatingsystem/v1.0.0"
          ],
          "simpleAttributeName": "operatingSystem",
          "attribute": "http://schema.org/operatingSystem",
          "label": "Operating system"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "releaseNotes",
          "attribute": "http://schema.org/releaseNotes",
          "label": "Release notes"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "url",
          "attribute": "http://schema.org/url",
          "label": "Url"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 2,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        }
      ]
    },
    {
      "id": "hbpkg/core/bookmarklist/v0.0.1",
      "group": "hbpkg",
      "label": "Bookmarklist",
      "properties": [
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 12,
          "canBe": [
            "hbpkg/core/bookmarklistfolder/v0.0.1"
          ],
          "simpleAttributeName": "bookmarkListFolder",
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkListFolder",
          "label": "Bookmark list folder"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 11,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 12,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "bookmarkList",
          "canBe": [
            "hbpkg/core/bookmark/v0.0.1"
          ],
          "attribute": "https://schema.hbp.eu/hbpkg/bookmarkList",
          "label": "Bookmark list",
          "reverse": true
        }
      ]
    },
    {
      "id": "minds/core/method/v1.0.0",
      "group": "minds",
      "label": "Method",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "qualifiedAssociation",
          "attribute": "http://www.w3.org/ns/prov#qualifiedAssociation",
          "label": "Qualified association"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 3,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        }
      ]
    },
    {
      "id": "modelvalidation/simulation/analysisresult/v1.0.0",
      "group": "modelvalidation",
      "label": "Analysisresult",
      "properties": [
        {
          "numOfOccurences": 10531,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 10531,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 10531,
          "simpleAttributeName": "distribution",
          "attribute": "http://schema.org/distribution",
          "label": "Distribution"
        },
        {
          "numOfOccurences": 10531,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 10491,
          "simpleAttributeName": "generatedAtTime",
          "attribute": "https://schema.hbp.eu/modelvalidation/simulation/analysisresult/v1.0.0/generatedAtTime",
          "label": "Generated at time"
        },
        {
          "numOfOccurences": 10531,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 10531,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 10531,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "hadMember",
          "canBe": [
            "modelvalidation/simulation/validationresult/v0.1.0",
            "modelvalidation/core/collection/v0.1.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#hadMember",
          "label": "Had member",
          "reverse": true
        },
        {
          "simplePropertyName": "referenceData",
          "canBe": [
            "modelvalidation/simulation/validationtestdefinition/v0.1.0"
          ],
          "attribute": "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/referenceData",
          "label": "Reference data",
          "reverse": true
        }
      ]
    },
    {
      "id": "datacite/core/doi/v1.0.0",
      "group": "datacite",
      "label": "Doi",
      "properties": [
        {
          "numOfOccurences": 678,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 678,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 57,
          "simpleAttributeName": "hashcode",
          "attribute": "http://hbp.eu/internal#hashcode",
          "label": "Hashcode"
        },
        {
          "numOfOccurences": 678,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 121,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 530,
          "simpleAttributeName": "citation",
          "attribute": "https://schema.hbp.eu/minds/citation",
          "label": "Citation"
        },
        {
          "numOfOccurences": 678,
          "simpleAttributeName": "doi",
          "attribute": "https://schema.hbp.eu/minds/doi",
          "label": "Doi"
        },
        {
          "numOfOccurences": 678,
          "canBe": [
            "minds/core/dataset/v1.0.0"
          ],
          "simpleAttributeName": "doireference",
          "attribute": "https://schema.hbp.eu/minds/doireference",
          "label": "Doireference"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 678,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 678,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 678,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "instance",
          "canBe": [
            "releasing/prov/release/v0.0.2"
          ],
          "attribute": "https://schema.hbp.eu/release/instance",
          "label": "Instance",
          "reverse": true
        },
        {
          "simplePropertyName": "wasDerivedFrom",
          "canBe": [
            "uniminds/options/doi/v1.0.0"
          ],
          "attribute": "http://www.w3.org/ns/prov#wasDerivedFrom",
          "label": "Was derived from",
          "reverse": true
        }
      ]
    },
    {
      "id": "softwarecatalog/options/device/v1.0.0",
      "group": "softwarecatalog",
      "label": "Device",
      "properties": [
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@id",
          "attribute": "@id",
          "label": "Id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "@type",
          "attribute": "@type",
          "label": "Type"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "identifier",
          "attribute": "http://schema.org/identifier",
          "label": "Identifier"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "name",
          "attribute": "http://schema.org/name",
          "label": "Name"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "screenshot",
          "attribute": "http://schema.org/screenshot",
          "label": "Screenshot"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "alternatives",
          "attribute": "https://schema.hbp.eu/inference/alternatives",
          "label": "Alternatives"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdAt",
          "attribute": "https://schema.hbp.eu/provenance/createdAt",
          "label": "Created at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "createdBy",
          "attribute": "https://schema.hbp.eu/provenance/createdBy",
          "label": "Created by"
        },
        {
          "numOfOccurences": 1,
          "simpleAttributeName": "immediateIndex",
          "attribute": "https://schema.hbp.eu/provenance/immediateIndex",
          "label": "Immediate index"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "lastModificationUserId",
          "attribute": "https://schema.hbp.eu/provenance/lastModificationUserId",
          "label": "Last modification user id"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "modifiedAt",
          "attribute": "https://schema.hbp.eu/provenance/modifiedAt",
          "label": "Modified at"
        },
        {
          "numOfOccurences": 4,
          "simpleAttributeName": "relativeUrl",
          "attribute": "https://schema.hbp.eu/relativeUrl",
          "label": "Relative url"
        },
        {
          "simplePropertyName": "device",
          "canBe": [
            "softwarecatalog/software/software/v1.0.0"
          ],
          "attribute": "http://schema.org/device",
          "label": "Device",
          "reverse": true
        }
      ]
    }
  ]
};

class StructureStore {
  @observable colorPaletteByLabel = new Map();
  @observable structure = null;
  @observable fetchStuctureError = null;
  @observable isFetchingStructure = false;
  colorPalette = null;

  @computed
  get groupedSchemas() {
    return groupBy(this.structure.schemas, "group");
  }

  @computed
  get sortedGroupedSchemas() {
    return Object.keys(this.groupedSchemas).sort();
  }

  @computed
  get hasSchemas() {
    return (
      !this.fetchStuctureError &&
      this.structure &&
      this.structure.schemas &&
      this.structure.schemas.length
    );
  }

  @computed
  get schemasMap() {
    const map = new Map();
    this.structure && this.structure.schemas && this.structure.schemas.length && this.structure.schemas.forEach(schema => map.set(schema.id, schema));
    return map;
  }

  @computed
  get schemasLabel() {
    const map = new Map();
    this.structure && this.structure.schemas && this.structure.schemas.length && this.structure.schemas.forEach(schema => map.set(schema.id, schema.label));
    return map;
  }

  getSortedSchemasByGroup(group) {
    return sortBy(this.groupedSchemas[group], ["label"]);
  }

  findSchemaById(id) {
    return this.schemasMap.get(id);
  }

  findLabelBySchema(schema) {
    return this.schemasLabel.get(schema);
  }

  @action
  async fetchStructure(forceFetch=false) {
    if (!this.isFetchingStructure && (!this.structure || !!forceFetch)) {
      this.isFetchingStructure = true;
      this.fetchStuctureError = null;
      try {
        // const response = await API.axios.get(API.endpoints.structure());
        API.endpoints.structure(); //TODO: remove this line
        setTimeout(() => {
          runInAction(() => {
            // this.structure = response.data;
            this.structure = mockup;
            this.isFetchingStructure = false;
          });
        }, 1000);
      } catch (e) {
        const message = e.message ? e.message : e;
        this.fetchStuctureError = `Error while fetching api structure (${message})`;
        this.isFetchingStructure = false;
      }
    }
  }

}

export default new StructureStore();
