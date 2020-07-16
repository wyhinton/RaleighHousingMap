
        L.TopoJSON = L.GeoJSON.extend({
          addData: function(data) {
            var geojson, key;
            if (data.type === "Topology") {
              for (key in data.objects) {
                if (data.objects.hasOwnProperty(key)) {
                  geojson = topojson.feature(data, data.objects[key]);
                  L.GeoJSON.prototype.addData.call(this, geojson);
                }
              }
              console.log("got loaded!");
              onTopoLoad();
              return this;
            }
            L.GeoJSON.prototype.addData.call(this, data);
            return this;
            }
        });

        L.Layer.prototype.setInteractive = function (interactive) {
            if (this.getLayers) {
                this.getLayers().forEach(layer => {
                    layer.setInteractive(interactive);
                });
                return;
            }
            if (!this._path) {
                return;
            }

            this.options.interactive = interactive;

            if (interactive) {
                L.DomUtil.addClass(this._path, 'leaflet-interactive');
            } else {
                L.DomUtil.removeClass(this._path, 'leaflet-interactive');
            }
        };


       //LAYERS
        let subdivisionsLayer;
        let subdivisionData = "data/GeoJSON/subDivTry8.json"
        let subdivisionDefaultStyle = {
          "color": "#ffffff",
          "weight": .5,
          "fillOpacity": 0
        }
        let subdivisionHoverStyle = {
          "color": "#ff0000",
          "weight": 1,
          "fillOpacity": .1,
        }
        let subdivisionClickStyle = {
          "color": "rgb(255, 255, 255)",
          "fillOpacity": .9,
        }
        let subDivEmptyStyle = {
          "color": "rgb(255, 0, 0)",
          "weight": 10,
          "fillOpacity": 0,
        }

        let historicSubDivsLayer;
        let historicSubDivsData = "data/GeoJSON/Historic_SubDivs_v2.geojson"
        let historicSubDivsStyle = {
          "color": "#ffe536",
          "fillOpacity": 1,
          "fillColor": '#ffffff',
          "weight": .1
        }
        let historicSubDivsHoverStyle = {
          "color": "#ffffff",
          "weight": .5,
          "fillOpacity": 0

        }
        let historicStyleLayer;

        let raleighLimitsLayer;
        let raleighLimitsLayerData = "data/GeoJSON/raleighLImitsgeoJSON.geojson"
        let raleighLimitsLayerStyleStart = {
          "color": "rgba(#ffffff, 0)",
          "weight": 0,
          "fillOpacity": .0

        }
        let raleighLimitsStyle = {
          "color": "#ffffff",
          "fillOpacity": 1,
          "opacity": .5
        }

        let majorHighwaysLayer;
        let majorHighwaysData = "data/GeoJSON/majorRaleighHighways.geojson";
        let majorHighWaysStyle = {
          "color": "#ffffff",
          "weight": 1,
          "fillOpacity": 1
        }

        const emptyStyle = {'fillOpacity' :0, "color": "#ffffff", 'weight': 0.5}
        const nonActiveStyle = {'fillOpacity' :.3, "color": "#5E5E5E", 'weight': 0.5}
      //KEYS
        let mydefaultKeyColorSet = ['#969696', '#7A7A7A', '#5E5E5E', '#414141', '#252525'];
        let redColors = ['#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04'];
        let blueColors = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];

        var mPrSqFtKey = makeKey("medianPrSqFt_2000", "MEDIAN PRICE PER SQUARE FOOT", 30, 300, redColors, "$/FT" + "<sup>2</sup>", "$", false);
        var mhpKey = makeKey("medianHPrice_2000", "MEDIAN HOME PRICE", 10000, 950000, redColors, "$", "$", true);
        var aosKey = makeKey("subDivAge_2000", "AGE OF SUBDIVISION", 0.0, 115, blueColors, "YEARS", "", false);
        var mahKey = makeKey("medianHage_2000", "MEDIAN AGE OF HOUSE", 0, 100, blueColors, "YEARS", "", false)
        var allKeys = [mPrSqFtKey, mhpKey, aosKey, mahKey];

        var allDivKeyObjects = [];

        //DATA
        var historyData = [
          {
            "Subdivision_Name": "BATTERY HEIGHTS",
            "Text": "Originally platted in 1915 and owned by Raleigh postmaster, Bartholomew Gatling, Battery Heights was mostly forested land until the mid-1930s. After Gatling passed away his son, John Gatling “was approached” by Battery Heights resident George Exum who sought to develop and contract lots for African American families. Between 1956 to 1964 Battery Heights expanded to include numerous African American professionals and Split-Level homes. The subdivision was one of four neighborhoods in Raleigh during the mid-1900s made for African Americans and has became known for its collection of post-World War II homes. The 11-acre subdivision was named a historic district on January 3, 2011.",
            "Extra_Facts": "",
            "Info_Link_1": "https://rhdc.org/battery-heights-historic-district-0",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA4430.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ea769445603ceb49353af8e_batterysmall.jpg",
            "Image_1_Attribution": "Map of Battery Heights, Courtesy of The National Register of Historic Places.",
            "Resource_Link_1": "https://rhdc.org/battery-heights-historic-district-0",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8defe063277b4fc9a462_hous.jpg",
            "Image_2_Attribution": "House in Battery Heights, Courtesy of Argintar, Sybil, National Register of Historic Places.",
            "Resource_Link_2": "https://rhdc.org/battery-heights-historic-district-0",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaef553b57fe11e81415998_batteree.jpg",
            "Image_3_Attribution": "Map of Battery Heights 1911, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_3": "http://www.wakegov.com/rod/Pages/default.aspx",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaef83fb8108ebee6513778_baee.jpg",
            "Image_4_Attribution": "Battery Heights, Courtesy of Strevel, Capital City Camera Club, Raleigh Historic Development Commission.",
            "Resource_Link_4": "https://rhdc.org/battery-heights-historic-district-0"
          },
          {
            "Subdivision_Name": "BLOOMSBURY",
            "Text": "Platted in 1914 by James Pou Jr., Bloomsbury was created to expand upon Raleigh’s suburban growth in the early to mid-1900s. Residents of Bloomsbury ranged from middle to upper class occupations such as doctors and insurance agents. The subdivision thrived from its accessibility to the Raleigh Street Car Line until automobiles became affordable in the 1930s. As the rise of the automobile allowed citizens of Raleigh to live farther from downtown, the Great Depression halted housing development  and the residential population of Bloomsbury. Blooombury's residential population continued to decline until the late-1900s when Raleigh endorsed efforts of urban revitalization. Bloomsbury was added to the National Register of Historic Places on May 16, 2002.",
            "Extra_Facts": "Bloomsbury Park, which was an amusement park located at the end of the Raleigh Streetcar Line in 1912, was created by the Carolina Power & Light Company to encourage citizens to ride the trolley. Although the park closed in 1920 it inspired people to purchase housing that ran along the streetcar line during the early 1900s.",
            "Info_Link_1": "https://rhdc.org/bloomsbury-historic-district",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA4063.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8fc230e1811c0ce9f791_blommd.jpg",
            "Image_1_Attribution": "Bloomsbury, Courtesy of Michael Zirkle, Raleigh Historic Development Commission",
            "Resource_Link_1": "https://rhdc.org/bloomsbury-historic-district",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ea76b75aad788a33a102949_bloom.jpg",
            "Image_2_Attribution": "Bloomsbury Park Circa 1900s, Courtesy of State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives/albums",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadc6f81d74126517139214_bloom1.jpg",
            "Image_3_Attribution": "Map of Bloombury Circa Early-1900, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_3": "http://www.wakegov.com/rod/Pages/default.aspxx",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaee09f1ffcb2a9d9bfb9d4_streetcar.jpg",
            "Image_4_Attribution": "Raleigh Street Car, Circa early-1900s, Photograph Collection, North Carolina State Archives.",
            "Resource_Link_4": "https://www.flickr.com/photos/north-carolina-state-archives"
          },
          {
            "Subdivision_Name": "BOYLAN HEIGHTS",
            "Text": "Established in 1907, on William Montfort Boylan's former 100-acre tract, Boylan Heights was one of Raleigh’s first planned suburbs. Creators of Boylan Heights matched each street and unique land curvature to Raleigh’s existing downtown grid. The subdivision catered to Raleigh’s architectural design and white middle class during its development in the early-1900s. Housing in Boylan included bunglows, Colonial Revivals, and Antebellum architecture such as the Boylan Mansion. Owners of Boylan Heights also instilled restrictive covenants that disallowed African Americans from being residents.    \n\nDuring the Great Depression many residents either moved to other suburbs or were not able to afford housing in Boylan Heights. Due to the residential decline, houses in Boylan Heights were either converted to rentals or broken into apartments. It was not until the mid-1980s that Raleigh began to renovate urban housing and establish historic districts which included Boylan Heights.       \n\nBoylan Heights became a historic district in the National Register of Historic Places on July 29, 1985.",
            "Extra_Facts": "",
            "Info_Link_1": "https://rhdc.org/raleigh-historic-resources/raleigh-historic-districts/boylan-heights",
            "Info_Link_2": "https://www.nps.gov/nr/travel/raleigh/boy.htm",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead85e555ede27576961590_boylan.jpg",
            "Image_1_Attribution": "Montfort Hall, Boylan Ave 1993, Courtesy of General Negative Collection. State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives.",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8795a46b766ca6718007_westernex.jpg",
            "Image_2_Attribution": "Western Boulevard Extension, recordation plan, South Boylan Avenue 1993. Courtesy of General Negative Collection. State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives..",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaef3a79269b47f3763f8fe_bw.jpg",
            "Image_3_Attribution": "Map of Boylan Heights 1911, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_3": "http://www.wakegov.com/rod/Pages/default.aspx",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaef6c705f3361b34d19b12_boy2c.jpg",
            "Image_4_Attribution": "Boylan Heights, Courtesy of Santiago Hernandez.",
            "Resource_Link_4": "https://rhdc.org/raleigh-historic-resources/raleigh-historic-districts/boylan-heights"
          },
          {
            "Subdivision_Name": "CAMERON VILLAGE",
            "Text": "Cameron Village was created in 1947 as a planned community and suburban shopping center in Raleigh by entrepreneurs J.W. York and R.A. Bryan. York and Bryan purchased 158 acres in West Downtown Raleigh with the aspiration to develop a residential subdivision that included shopping centers and apartments for single-home families. Once the Cameron Village shopping center opened in 1949 it became a main attraction for citizens of Raleigh. The open-air shopping mall continued to expand through the late-1970s containing over 70 stores and 600 apartments.",
            "Extra_Facts": "In 2003 the Occidental Life Insurance Company Building was added to the National Register of Historic Places. The four-story 68,000 sq-ft building (built in 1956), played a role in the growth of Cameron Village during the early 1950s.  \n\nWhen Cameron Village was completed it intersected with one of Raleigh's African American communities, Oberlin Village. Much of Cameron Village's expansion overshadowed Oberlin’s history and neighborhood development.  \n\nDuring the 1970s, Cameron Village opened “The Village Subway. The Subway was an underground entertainment area beneath what is now the Fresh Market.",
            "Info_Link_1": "https://www.ncpedia.org/cameron-village",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA4298.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead86a9328706dd4157ac56_CameronApartments.jpg",
            "Image_1_Attribution": "Cameron Village Apartments 1949, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives..",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead89011d7412f34dec3d03_Camer.jpg",
            "Image_2_Attribution": "Aerial Views of Cameron Village Apartments 1949, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadba54f63403822ccec8d1_33480722731_885bc3e2bc_w.jpg",
            "Image_3_Attribution": "Cameron Village Branch Wachovia 1950, Albert Barden Collection,State Archives of North Carolina.",
            "Resource_Link_3": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadba2af6340370cbcec2ad_cam1.jpg",
            "Image_4_Attribution": "Cameron Village, Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_4": "https://www.flickr.com/photos/north-carolina-state-archivess"
          },
          {
            "Subdivision_Name": "COLLEGE PARK",
            "Text": "Founded in 1912 by developer D.J. Fort Jr., College Park was created to house numerous prosperous African American professionals and educators. Many of its early homeowners resulted from its proximity to St. Augustine University, St. Agnes Hospital, and black-owned businesses along East Hargett Street. During the 1970s, College Park became heavily affected by suburbanization, as crime and housing deterioration rose in downtown Raleigh. However, through neighborhood task force events and revitalization programs during the mid-2000s, College Park has become an attractive subdivison of first time home buyers. \n     \nCurrently, East College Park is under redevelopment by Raleigh’s Housing & Development Department. The City, which started construction in 2018, seeks to develop “98 single family homes and 51 townhome units” by 2024. \n\nAlthough the City seeks to bring first time homeowners to East College Park, the plan threatens current renters and residents due to growing property taxes that correlate with neighborhood and city revitalization.",
            "Extra_Facts": "In October of 2019 RD Construction violated its building contract with the City of Raleigh. RD breached the contract by “building a home for one of its employees larger than what is allowed in one of Raleigh’s affordable housing developments.”",
            "Info_Link_1": "https://indyweek.com/news/wake/residents-buying-raleigh-s-plans-east-college-park/",
            "Info_Link_2": "http://ecp.raleighnc.gov/#current",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead895c12d9ff5e6688e537_Lyman.jpg",
            "Image_1_Attribution": "Lyman Building, St. Augustine’s University 1886. Courtesy of General Negatives Collection, State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives.",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaedbe7827083f3dc434a44_st.an.jpg",
            "Image_2_Attribution": "St. Agnes Hospital Nurses 1949, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaeddacd985384b2740a292_st.an1.jpg",
            "Image_3_Attribution": "Saint Agnes Hospital- Raleigh, NC July 21, 1944 Exterior, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_3": "https://www.flickr.com/photos/north-carolina-state-archivess",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8952328706bf5358a0dd_collegepark.jpg",
            "Image_4_Attribution": "East College Park Construction Circa 2017, Courtesy of Raleigh Housing and Neighborhoods Department.",
            "Resource_Link_4": "https://raleighnc.gov/housing-and-neighborhoods"
          },
          {
            "Subdivision_Name": "FULLER HEIGHTS",
            "Text": "Created in 1928, Fuller Heights is a representation of “post-World War II residential development” that occured in Raleigh during the mid-1900s. Majority of the subdivisions housing was built during the early-1950s as a result of Ralegh’s growth in infrastructure and population after WWII. Fuller Heights still contains side-gable homes and non-commercial developments.",
            "Extra_Facts": "As of February 10, 2019, the City of Raleigh Parks, Recreation and Cultural Department created a possible master plan that would connect Dorothea Dix Park to Downtown Raleigh and Fuller Heights.",
            "Info_Link_1": "https://rhdc.org/sites/default/files/2017_ArchitecturalSurveyReport_SHPOacceptedWEB.pdf",
            "Info_Link_2": "https://www.newsobserver.com/latest-news/article225525025.html",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead91940ee69e9545655f9a_fuller.jpg",
            "Image_1_Attribution": "Courtesy of Google Images 2016",
            "Resource_Link_1": "",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead93b34894153248674028_fullerhe.jpg",
            "Image_2_Attribution": "Fuller Heights Plat 1928, Courtesy of Hanbury Preservation Consulting.",
            "Resource_Link_2": "http://www.hanburypreservation.com/",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaee9eb9269b456695e2b05_dor.jpg",
            "Image_3_Attribution": "Fuller Heights, 1400 Lake Wheeler Road, Courtesy of Hanbury Preservation Consulting.",
            "Resource_Link_3": "http://www.hanburypreservation.com/",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaeeb52489415f4e901d4bb_fuller1.jpg",
            "Image_4_Attribution": "Fuller Heights, Curfman 1424 Street, Courtesy of Hanbury Preservation Consulting.",
            "Resource_Link_4": "http://www.hanburypreservation.com/"
          },
          {
            "Subdivision_Name": "GLENWOOD",
            "Text": "Once known as Will’s Forest, a free African American man in the late 1700s, the Glenwood Ave-Brooklyn area was founded by James H. Pou, Albert Murray, and Willam J. Andrews in 1905. Pou, Murray, and Andrews created the Glenwood Land Company to “develop” the Glenwood-Brooklyn area. The company registered the current site of Glenwood in 1906 “extending from West Peace Street to Wade Avenue.” \n\nGlenwood was planned with the intention to urbanize Raleigh’s infrastructure. Throughout the early-1900s the neighborhood was given access to the Raleigh Streetcar Line, craftsman-style housing, and newly paved streets. Owners of Glenwood only catered to Raleigh’s white middle class as African Americans were restricted through deed covenants and lot pricing excluded people of low income.  \n\nGlenwood was added to the National Register of Historic Places on July 29, 1985. Brooklyn was added later on February 20, 2002.",
            "Extra_Facts": "",
            "Info_Link_1": "https://rhdc.org/glenwood-brooklyn-historic-district-1",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA4189.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead95773025f199094e0818_cantre.jpg",
            "Image_1_Attribution": "Glenwood Avenue and St. Mary's Street, Courtesy of Courtesy of the State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives.",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead969cbd54497115d0cbd3_school.jpg",
            "Image_2_Attribution": "Glenwood School Circa early-1900s. Courtesy of the State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaee2858feeea469afea9a1_pig.jpg",
            "Image_3_Attribution": "Piggly Wiggly at Five Points in Raleigh, NC. Whitaker Mill Road and Glenwood Avenue Circa 1952, Albert Barden Collection, North Carolina State Archives.",
            "Resource_Link_3": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaee33c9269b443875b8611_gle.jpg",
            "Image_4_Attribution": "Glenwood Ave and Johnson St. Circa 1950, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_4": "https://www.flickr.com/photos/north-carolina-state-archives"
          },
          {
            "Subdivision_Name": "HAYES BARTON",
            "Text": "Platted and developed throughout the early-1920s, Hayes Barton was apart of Raleigh’s “second wave of suburban development.” The subdivision prospered from its “naturalistic landscape”, made by architect Earle Summer Draper, and amenities. Hayes Barton's proximity to the Raleigh Streetcar Line gave residents access to significant locations in Raleigh such as Bloomsbury Park, The Tudor Revival Myrtle Underwood School, and numerous shops along Glenwood. Because Hayes Barton had numerous residential advantages many of its residences were upper class professionals and politicians.        \n\nHayes Barton was added to the National Register of Historic Places on May 16, 2002.",
            "Extra_Facts": "Hayes Barton is defined as a Five Points Historic Neighborhood. These neighborhoods are classified as Raleigh’s “second wave of white suburban development” created around the Five Points intersection. \n\nHayes Barton was named after Sir Walter Raleigh’s “English home place.”",
            "Info_Link_1": "https://rhdc.org/hayes-barton-historic-district",
            "Info_Link_2": "https://rhdc.org/five-points-historic-neighborhoods",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead9823eed19866c74b0754_hanyes.jpg",
            "Image_1_Attribution": "Hayes Barton Baptist Church 1942, Courtesy of State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives..",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead994e328706534a60d01e_haynesbart.jpg",
            "Image_2_Attribution": "Hayes Barton Baptist Church 1951, Courtesy of State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead9a441ffcb2e340231cfd_hanw.jpg",
            "Image_3_Attribution": "Hayes Barton Branch Wachovia 1952, Courtesy of the State Archives of North Carolina.",
            "Resource_Link_3": "https://www.flickr.com/photos/north-carolina-state-archivess",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead9b69328706246d61f758_bart.jpg",
            "Image_4_Attribution": "Courtesy of Michael Zirkle, Raleigh Historic Development Commission.",
            "Resource_Link_4": "https://rhdc.org/hayes-barton-historic-district"
          },
          {
            "Subdivision_Name": "LONGVIEW GARDENS",
            "Text": "Developed throughout 1938 to the mid-1960s by Clarence Poe, “longtime editor of the Progressive Farmer,\" Longview Gardens was created to be, “Raleigh’s Most Beautiful Subdivision” in the words of Poe. In 1937, several civil engineers and landscape architects such as Henry Law Olmsted and Chales Gillette, were hired to develop an aesthetic appeal for the subdivision. Their beautification efforts resulted in “a pattern of curvilinear streets flanking both sides of a designed parkway.” Longview Gardens' aesthetic appealed to middle and high income residents of Raleigh. Its upper class residency and large landscape also interested members of the Raleigh Country Club, which acquired a tract of land in the subdivision in the late 1940s. The course was designed by famous golfer Donald Ross.    \n\nCurrently, Longview Gardens is the largest mid-20th century subdivision in Raleigh. Longview Gardens was added to the National Register of Historic Places on January 3, 2011.",
            "Extra_Facts": "Longview Gardens contains a mixture of revival architecture due to its staggered development throughout the mid-1900s. The subdivision has structures from Raised-Ranch houses to Split-level Modernist dwellings. \n\nLongview Gardens is the home of Modernist structures Longview Baptist Church (1955) and Milner Memorial Presbyterian Church (1958).",
            "Info_Link_1": "https://rhdc.org/longview-gardens-historic-district",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA4441.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead9c197916379ac0f061be_Longview.jpg",
            "Image_1_Attribution": "Aerial View of Longview Gardens 1949, Courtesy of State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives.",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead9ca832870643f4627853_Longview1.jpg",
            "Image_2_Attribution": "Aerial View of Longview Gardens 1948, Courtesy of State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archivess",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead9d8f1d7412c7f1f9db32_counrtclub.jpg",
            "Image_3_Attribution": "Country Club, Raleigh Postcard, Courtesy of State Archives of North Carolina.",
            "Resource_Link_3": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead9f1430e1816a46f05643_WA5285_Raleigh_2520AlbemarleRd_10-09_rml-07_web.jpg",
            "Image_4_Attribution": "Longview Gardens Historic District, Courtesy of Longleaf Historic Resources",
            "Resource_Link_4": "https://www.presnc.org/pan/longleaf-historic-resources/"
          },
          {
            "Subdivision_Name": "METHOD",
            "Text": "Method was created in 1872 by freedmen Jesse Mason and Isaac O'Kelly as an urban housing community for African Americans during Reconstruction. During its early years, in the late 1800s, resident housing included “single-room” log or “slab cabins” that only served to provide essential housing for a rapidly growing urban African American population.By the early 1900s the community of Method progressed to include restrained bungalows, one-story vernacular Triple A homes, and a Gothic Revival brick church named St. James A.M.E. Church. A significant part of Method’s growth was attributed to African American banker and philanthropist, Berry O’ Kelly, who renovated his preexisting school in the neighborhood during 1914, into a ten classroom, elementary and high school. The school was given the name Berry O’Kelly Training School and became one of only three “county teacher- training and industrial” schools in North Carolina.   \n\nOn May 1, 2017, both the Berry O’ Kelly School Campus and St. James A.M.E, Church became a part of the Berry O’ Kelly Historic District.",
            "Extra_Facts": "Because housing in Method during the late 1800s included single-room cabins the settlement was given two names, “Slabtown and Save-Rent.” \n\nBy 1931 Berry O’ Kelly School High School became the largest high school for African Americans in North Carolina.",
            "Info_Link_1": "https://rhdc.org/sites/default/files/Method%20Context%20Edited.pdf",
            "Info_Link_2": "https://www.ncpedia.org/biography/okelly-berry",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ea7411ac9869a71f9a7710c_6814610731_34361ace58_w.jpg",
            "Image_1_Attribution": "Berry O' Kelly School Circa Early 1900s, Courtesy of the Raleigh City Museum.",
            "Resource_Link_1": "https://cityofraleighmuseum.org/",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ea768363e3fd049b71213c7_Method1920.jpg",
            "Image_2_Attribution": "Method Subdivision 1920, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_2": "http://www.wakegov.com/rod/Pages/default.aspx",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eada107a46b762c957c634d_St.jpg",
            "Image_3_Attribution": "Saint James African Methodist Episcopal Church 2009, Courtesy of B. Fullington, Capital City Camera Club.",
            "Resource_Link_3": "https://raleighhistoric.org/items/show/94?tour=15&index=0",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eada297687e2d72ffeb8248_berrylife.jpg",
            "Image_4_Attribution": "Saint James African Methodist Episcopal Church 2009, Courtesy of State Archives of North Carolina.",
            "Resource_Link_4": "https://www.flickr.com/photos/north-carolina-state-archives"
          },
          {
            "Subdivision_Name": "MORDECAI",
            "Text": "Located on the plantation land and house of the Mordecai family, Mordecai was a suburb created during Raleigh’s single home residential growth during the early 1900s. Starting in 1916, “land south” of the Mordecai House was subdivided to develop Colonial Revival style housing.   \n\nIn 1922, Martha Mordecai, a family member of the Mordecai family, sold the northern portion of the plantation to “real estate developers Dan and Frank Allen.” She mandated numerous conditions to the residential development of Mordecai including renaming the subdivision to Mordecai Place and implementing deed restrictions that disallowed African Americans from living inside most of its housing areas. Mordecai expanded throughout the 1920s and 30s due to its development of revival style architecture and enclosed middle class community.    \n\nIn 1967 the Mordecai House was purchased by the City in an effort to preserve Raleigh’s history and establish a historic park. The subdivision was added to the National Register of Historic Places on February 4, 1998.",
            "Extra_Facts": "The Mordecai House was built by Joel Lane in 1785. The house is the “oldest residence in Raleigh on its original foundation” and enclosed more than 5,000 acres.The house is named after prominent lawyer, Moses Mordecai, who married into the Lane family. \n\nMartha Mordecai only reserved eighteen acres in Mordecai (located around Raleigh’s railroad) that could be sold to African American.",
            "Info_Link_1": "https://rhdc.org/mordecai-place-historic-district-3",
            "Info_Link_2": "https://www.nps.gov/nr/travel/raleigh/mor.htm",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8affff709c5878b65fc6_morhouse.jpg",
            "Image_1_Attribution": "Mordecai House Circa 1896-97. North Carolina Musuem of History.",
            "Resource_Link_1": "https://www.ncmuseumofhistory.org/",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eada4b9bd5449531fd48303_mor.jpg",
            "Image_2_Attribution": "Mordecai Historic District, Michael Zirkle, Raleigh Historic Development Commission.",
            "Resource_Link_2": "https://rhdc.org/mordecai-place-historic-district-3",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadaa1c0ee69e18417747f1_mod.png",
            "Image_3_Attribution": "Mordecai House circa 1785 Reconstruction, NC State School of Design 1957, Courtesy of NCSU Libaries' Digital Collections.",
            "Resource_Link_3": "https://d.lib.ncsu.edu/collections/catalog/bh010104202#?c=&m=&s=&cv=&xywh=-3400%2C0%2C15764%2C6872",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadaa20091b866ea59e1b27_and.png",
            "Image_4_Attribution": "Supposed birthplace of Andrew Johnson, Courtesy of NCSU Libaries' Digital Collections.",
            "Resource_Link_4": "https://d.lib.ncsu.edu/collections/catalog/0012803#?c=&m=&s=&cv="
          },
          {
            "Subdivision_Name": "OAKWOOD",
            "Text": "Originally built in Northeast Raleigh, Oakwood was sold “in parcels” to wealthy landowners and developers Col. Johnathan McGee Heck, William Stanhope Pullen, Thomas Briggs, and, W.C. and A.B. Stronach. The neighborhood was a representation of wealth acquired by Raleigh elites before the Civil War and throughout the early 1900s. Because Oakwood was located near St. Augustine’s Chapel, the Mordecai House, and State Capital much of its residents were prominent Raleigh officials. Oakwood was also known for its aesthetic significance rooted in Victorian-era architecture. \n\nDuring WWI and the Great Depression residents of Oakwood moved to other neighborhoods in Raleigh. Due to the decrease in homeowners many large residences in Oakwood were converted to apartments. It was not until 1970 that homeowners of Oakwood began urban renewal efforts. In 1972, The Society for the Preservation of Historic Oakwood was created resulting in the rejection of a North Carolina State Capital Plan to build a highway through Oakwood.   \n\nOakwood was Raleigh’s first local historic district and was added to the National Register of Historic Places on June 25, 1974 with additions made in 1987, 1988, and 1989.",
            "Extra_Facts": "Oakwood is North Carolina’s largest intact 19th century neighborhood. The subdivsion was unique compared to other suburbs in Raleigh because it was developed by lot.",
            "Info_Link_1": "https://files.nc.gov/ncdcr/nr/WA0062.pdf",
            "Info_Link_2": "https://www.historicoakwood.org/neighborhood-history",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadac4b55ede224b6ab994b_oak1.jpg",
            "Image_1_Attribution": "Oakwood Cemetery 1932, State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives.",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadac50ca7202c251c72152_oak.jpg",
            "Image_2_Attribution": "Oakwood Cemetery 1932, State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadb0258feeea1b417d7217_oak3.jpg",
            "Image_3_Attribution": "Courtesy of Preservation North Carolina Historic Architecture Slide Collection, NC State Digital Collections.",
            "Resource_Link_3": "https://d.lib.ncsu.edu/collections/catalog/bh2084pnc017",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadb030b8108e75d7d75a21_oak4.jpg",
            "Image_4_Attribution": "Courtesy of Preservation North Carolina Historic Architecture Slide Collection, NC State Digital Collections.",
            "Resource_Link_4": "https://d.lib.ncsu.edu/collections/catalog/bh2084pnc017"
          },
          {
            "Subdivision_Name": "PULLEN PARK TERRACE",
            "Text": "Pullen Park Terrace was created in 1925 by Herbert A. Carton. The subdivision originated from a 7-acre farmland tract donated by philanthropist and founder of Pullen Park, Richard Stanhope Pullen. Pullen Terrace benefited from its proximity to Pullen Park as its residential development expanded around the parkland during the mid-1900s. Several of the homes created in the 1950s are still being leased or sold today.",
            "Extra_Facts": "The original plot of Pullen Park Terrace included 68 lots surrounding Raleigh's Western Boulevard surveyed by L.E. Wooten. \n\nPullen park was founded in 1887, listed as the oldest public park in North Carolina.  Ever since its conception, the park was given numerous attractions including the Pullen Park Carousel (1921), Theatre in the Park (1947), and the Pullen Aquatic Center (1992).  \n\nThe Pullen Park Carousel was added to the National Register of Historic Places on September 8, 1976.",
            "Info_Link_1": "https://tclf.org/pullen-park",
            "Info_Link_2": "http://goodnightraleigh.com/2013/06/a-hidden-gem-raleighs-pullen-park-terrace/",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadb1e212d9ffd538a0d6fe_pullenpark.jpg",
            "Image_1_Attribution": "Construction at Pullen Park 1934, Courtesy of University Archives Photograph Collection, Special Collections Research Center at NC State University Libraries.",
            "Resource_Link_1": "https://d.lib.ncsu.edu/collections/catalog?utf8=%E2%9C%93&q=Pullen+Park+Terrace",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadb44da46b7664da82791f_pullenpark2.jpg",
            "Image_2_Attribution": "Pullen Park Pond 1934, Courtesy of North Carolina State University, Division of Student Affairs, Student Media Authority Records, 1909-2011, Special Collections Research Center at NC State University Libraries.",
            "Resource_Link_2": "https://d.lib.ncsu.edu/collections/catalog/0012802",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadb5cb687e2dc63bf61676_park1.jpg",
            "Image_3_Attribution": "Map of Pullen Park Terrace 1925, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_3": "http://www.wakegov.com/rod/Pages/default.aspx",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadb80bb48e3adbfd0db9ed_park3.jpg",
            "Image_4_Attribution": "Construction of Pullen Park Bridge, Courtesy of North Carolina State University, Division of Student Affairs, Student Media Authority Records, 1909-2011, Special Collections Research Center at NC State University Libraries.",
            "Resource_Link_4": "https://d.lib.ncsu.edu/collections/catalog/ua016_035-007-bx0018-009-001"
          },
          {
            "Subdivision_Name": "ROANOKE PARK",
            "Text": "Roanoke Park was platted in 1922. The subdivision was developed during Raleigh’s second suburban expansion during the early 1900s, which catered to “white first-time homebuyers” and middle class citizens. Roanoke Park was able to constantly expand throughout the 1920s due to proximity to the Raleigh Streetcar Line, which allowed residents to commute downtown. Roanoke Park also became known for its architectural development as many of its homes shared atheistic simliarites to Hayes Barton and contained examples of mid-1900 American craftsmanship.   \n\nRoanoke Park was added to the National Register of Historic Places on May 9, 2003.",
            "Extra_Facts": "Roanoke Park is defined as a Five Points Historic Neighborhood. These neighborhoods are classified as Raleigh’s “second wave of white suburban development” created around the Five Points intersection.\n\nRoanoke Park is also the largest subdivision out of six listed in the Roanoke Historic District.",
            "Info_Link_1": "https://rhdc.org/roanoke-park-historic-district-1",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA3145.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadc1db12d9ff5aa8a9be69_roan.jpg",
            "Image_1_Attribution": "Map of Roanoke Park 1915, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_1": "http://www.wakegov.com/rod/Pages/default.aspx",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaee7f1bd5449717d6ad182_NRHD_RoanokePark.png",
            "Image_2_Attribution": "Map of Roanoke Park Historic District, Courtesy of Raleigh Historic Development Commission.",
            "Resource_Link_2": "https://rhdc.org/roanoke-park-historic-district-1",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaef06bff709c3c78539833_streee.jpg",
            "Image_3_Attribution": "Raleigh Street Cars, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_3": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaef184e0632770ef550f6c_imp.jpg",
            "Image_4_Attribution": "Roanoke Park, Courtesy of Roanoke Park Playground",
            "Resource_Link_4": "https://raleighparks.wordpress.com/tag/roanoke-park-playground/"
          },
          {
            "Subdivision_Name": "ROCHESTER HEIGHTS",
            "Text": "Created on land owned by “Anna Roberta Lighter,\" Rochester Heights was a post-World War II subdivision created for African Americans.\n\nStarting in 1954, after Lightner sold the land to the “M.C. Garner of the Phillips Building Corporation”, the firm established a uniform-grid structure for land development, Split-level housing, and streets named after famous African Americans. Rochester Heights also had many significant African American residents such as North Carolina Senator Vernon Malone, and Civil Rights attorney, Samuel Mitchell. \n\nThe 39-acre subdivision was added to the National Register of Historic Places on December 7, 2011.",
            "Extra_Facts": "Lawrence Eugene Lightner was the brother of Raleigh’s first black mayor, Clarence E. Lightner.\n\nRochester Heights contains a significant amount of Raleigh’s “intact” post-World War II housing.",
            "Info_Link_1": "rhdc.org/rochester-heights-historic-district",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA4581.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadc2f148941559d37c2c7f_ron1.jpg",
            "Image_1_Attribution": "Map of Rochester Heights 1958, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_1": "http://www.wakegov.com/rod/Pages/default.aspx",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaee486d985385b5543b4e0_lightner.jpg",
            "Image_2_Attribution": "Lightner Arcade (owned by Calvin E. Lightner, the father of Clarence Lightner) 1921, Courtesy of General Negatives Collection, State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaee5a655ede281b531afa5_hist.jpg",
            "Image_3_Attribution": "Map of Rochester Heights Historic District, Courtesy of Raleigh Historic Development Commission.",
            "Resource_Link_3": "https://rhdc.org/rochester-heights-historic-district",
            "Image_4_Link": "",
            "Image_4_Attribution": "",
            "Resource_Link_4": ""
          },
          {
            "Subdivision_Name": "VANGUARD PARK",
            "Text": "Developed from 1920 through the 1950s, during Raleigh's second wave of suburbanization, Vanguard Park is a representation of 20th century single family housing and duplexes. Vanguard Park shared many similarities to its neighbor subdivision, Roanoke Park, during the early 1900s such as Craftsman-style housing and its utilization of the Raleigh Streetcar Line. Residents of the subdivision varied from clerks to blue-collar tradesmen that worked in factories along Raleigh's central business district. Vanguard reached its peak in housing development between 1945-1952 after Raleigh’s financial growth post-WWII.          \n\nVanguard Park was added to the National Register of Historic Places on May 9, 2003.",
            "Extra_Facts": "Vanguard Park is defined as a Five Points Historic Neighborhood. These neighborhoods are classified as Raleigh’s “second wave of white suburban development” created around the Five Points intersection.",
            "Info_Link_1": "https://rhdc.org/vanguard-park-historic-district-1",
            "Info_Link_2": "https://rhdc.org/five-points-historic-neighborhoods",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadc030791637762a04df93_van1.jpg",
            "Image_1_Attribution": "Map of Vanguard Park 1915, Courtesy of Wake County Register of Deeds.",
            "Resource_Link_1": "http://www.wakegov.com/rod/Pages/default.aspx",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaeeca1827083ab1c4b732a_westermm.jpg",
            "Image_2_Attribution": "Westminster Presbyterian Church, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaeee6732870607fcf34c64_maybe.jpg",
            "Image_3_Attribution": "Elevated View of Fayetteville Street from top of State Capitol (Residents of Fuller Heights communted to Fayetteville St.), 1950, Waller Studio Photograph Collection, State Archives.",
            "Resource_Link_3": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_4_Link": "",
            "Image_4_Attribution": "",
            "Resource_Link_4": ""
          },
          {
            "Subdivision_Name": "OBERLIN VILLAGE",
            "Text": "Oberlin Village was founded in 1866 by James H. Harris, a former slave and graduate of Oberlin College in Ohio. Named in tribute of Oberlin College, Oberlin was created to establish a freedman community in Raleigh that supported values of education and African American achievement. By 1880 Oberlin expanded to approximately 150 black households making it one of the largest black settlements in Wake County during Reconstruction. Through its progression in Northeast Raleigh, Oberlin was the center for many significant African American establishments including Wilson Temple United Methodist Church (late-1860s), Oberlin School (1873), Oberlin Baptist Church (1880), Latta University (1892), and Murphy School.",
            "Extra_Facts": "“ When I came here, Oberlin was a fine Community, one of the finest in Raleigh at the time. It was bound on the west by Dixie Trail, on the North by what is known as Wade Avenue, and on the south by Hillsborough Street. Oberlin had doctors, lawyers, teachers, nurses, and others. It was an educated community.”- Tulia H. Turner, president of Oberlin for over 70 years (Interview, March 13, 1990, Culture Town, Simmons-Henry & Edmisten)",
            "Info_Link_1": "https://raleighhistoric.org/tours/show/16",
            "Info_Link_2": "https://northcarolinahistory.org/encyclopedia/oberlin-village/",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8bf21d74126838ed8d4f_oberlin1954.jpg",
            "Image_1_Attribution": "North Carolina Oberlin Road and Cemetery 1954, Courtesy of the Conservation and Development Photograph File, State Archives of North Carolina.",
            "Resource_Link_1": "https://www.flickr.com/photos/north-carolina-state-archives.",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8b9d1ffcb252c01b01f4_oberlinschool.jpg",
            "Image_2_Attribution": "Old Oberlin School Circa 1882,1916, Courtesy of Albert Barden Collection, State Archives of North Carolina.",
            "Resource_Link_2": "https://www.flickr.com/photos/north-carolina-state-archives",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaed904e0632774ca49dfe7_latta1.jpg",
            "Image_3_Attribution": "Latta House 1989, Courtesy of Raleigh Historic Commission, North Carolina State Archives.",
            "Resource_Link_3": "https://raleighhistoric.org/items/show/47?tour=16&index=6#&gid=1&pid=3",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eaed9138feeea7e40f98702_latta2.jpg",
            "Image_4_Attribution": "Latta House 2006, Courtesy of Raleigh Historic Commission, North Carolina State Archives.",
            "Resource_Link_4": "https://raleighhistoric.org/items/show/47?tour=16&index=6#&gid=1&pid=3"
          },
          {
            "Subdivision_Name": "CAMERON PARK",
            "Text": "Cameron Park was created in 1910 by the Hunter-Parker Company during the establishment of Raleigh suburbs in the early-1900s. Cameron Park thrived from its location inside the Raleigh’s Streetcar Line which helped residential transportation and convenience. Owners of Cameron Park sought to house “middle-upper” class white citizens. Developers created restrictive covenants that excluded African Americans from being residents.    \n\nCameron Park has become known for its architectural styles ranging from Colonial Revivals to bungalows. In 1985 the neighborhood became a historic district listed on the National Register of Historic Places.",
            "Extra_Facts": "Covenant Statement in 1914:\n “That the premises shall not be occupied by negroes or persons of negro blood; provided, that this shall not be construed to prevent the living upon the premises .of any negro who is employed for domestic purposes by the occupants of the dwelling houses on said land.” \n\nCameron Park was created from “extensive landholdings of the Cameron Family.”\n\nOwners of Cameron Park viewed their community as the future of Raleigh because of its development in technology and aesthetic quality: \n “The very beauty of the site, its distant prospects, its physical relation to the city of Raleigh, its multitude of possibilities encompassed every imaginable desire of the home loving heart, and its growth, into what it is today, was but the natural result. Cameron Park of today is a city of dreams realized, ideals come into actual being, with the beginning barely behind us and the greater possibilities of the' future at our very thresholds.”",
            "Info_Link_1": "https://rhdc.org/cameron-park-historic-district",
            "Info_Link_2": "https://files.nc.gov/ncdcr/nr/WA0194.pdf",
            "Image_1_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8c28ff709c08abb6cd39_cameronparkbro.jpg",
            "Image_1_Attribution": "Cameron Park 1914, Printing Co. General Collection.",
            "Resource_Link_1": "",
            "Image_2_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5ead8c3330e1813aeae85fbc_cameronparkwade.jpg",
            "Image_2_Attribution": "Cameron Park Promotional Brochure 1914, Printing Co. General Collection. State Library of North Carolina.",
            "Resource_Link_2": "https://drive.google.com/file/d/1FcMTRKCsRM4beWiFiYfaiSqlaPaElMh8/view?usp=sharing",
            "Image_3_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadbc6abd5449efe5dd1b13_cam23.jpg",
            "Image_3_Attribution": "Cameron Park Promotional Brochure 1914, Printing Co. General Collection. State Library of North Carolina.",
            "Resource_Link_3": "https://drive.google.com/file/d/1FcMTRKCsRM4beWiFiYfaiSqlaPaElMh8/view?usp=sharing",
            "Image_4_Link": "https://uploads-ssl.webflow.com/5e98b0994a1b9065a6b0f458/5eadbc728feeea81dd81e3d3_cam231.jpg",
            "Image_4_Attribution": "Cameron Park Promotional Brochure 1914, Printing Co. General Collection. State Library of North Carolina.",
            "Resource_Link_4": "https://drive.google.com/file/d/1FcMTRKCsRM4beWiFiYfaiSqlaPaElMh8/view?usp=sharing"
          }
        ]
        let HistoricSubDivs = ['BATTERY HEIGHTS', 'BLOOMSBURY', 'BOYLAN HEIGHTS', 'CAMERON VILLAGE', 'COLLEGE PARK', 'FULLER HEIGHTS', 'GLENWOOD', 'HAYES BARTON', 'LONGVIEW GARDENS', 'METHOD', 'MORDECAI', 'OAKWOOD', 'PULLEN PARK TERRACE',
          'ROANOKE PARK', 'ROCHESTER HEIGHTS', 'VANGUARD PARK', 'OBERLIN VILLAGE', 'CAMERON PARK'
        ];
        var yearsForData = ["2000", "2005", "2010", "2015", "2020"]

        //ACTIVE
        var currentYear = 2000;
        var curActiveKey = null;
        var curActiveFeature;
        var curActivePopUp;
        var inHistoricView = false;
        var activeYearIndex = 0;
        let subDivHasHistoryEntry;
        var allInactive = true;
        var activeColor
        var inSoloView = false;
        var curSoloObjs = [];
        var downloadHasBeenActivated = false;

        var downloadCollection = {
            "type": "FeatureCollection",
            "features": []
        };
        //SPINNER
        let loaded = false;
        let spinnerSettings = {
          lines: 12,
          color: "rgb(255, 255, 255)",
          width: 4
        }

        //MISC
        let stripePatternOptions = {
          weight: 4,
          spaceWeight: 4,
          color: "#ff8d00",
          spaceColor: "#2ca6b3",

          opacity: 1.0,
          spaceOpacity: 1.0

        }
        var slider = $('#myCarousel').slick({
         infinite: false,
         lazyLoad: 'ondemand',
         slidesToShow: 1,
         slidesToScroll: 1,
         initialSlide: 1,
         centerMode: true,
         arrows: true,
         dots: true

        })
        async function getOpenStreetMap() {
          const response = await fetch(api_url);
          const data = await response.json();
        }
        //HTML ELEM VARIABLES
        var prevArrow = document.getElementById('prevYearArrow');
        var nextArrow = document.getElementById('nextYearArrow');
        var yearDisp = document.getElementById('yearDisplay');
        let indicatorSet = document.getElementsByClassName('dateSelectionIndex');
        let downloadButton = document.getElementById('dataDownloadButton')

        //MAP
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

        function toggleLeftSidebar(afeature) {
          if (subDivHasHistoryEntry === true) {
            leftSidebar.toggle();
            $('#myCarousel').css('display', 'block');
            $('#myCarousel').get(0).slick.setPosition()

          }
        }


        //MAP SETUP
        var mymap = new L.Map('issMap', {
          center: new L.LatLng(35.7926, -78.6434),
          zoom: 11.5,
          zoomControl: false,
          minZoom: 12,
          maxZoom: 14,
          fullscreenControl: true,
        });

        mymap.scrollWheelZoom.disable();
        mymap.dragging.disable();

        mymap.on('click', function(e) {
          var coord = e.latlng;
          var lat = coord.lat;
          var lng = coord.lng;
        });

        var leftSidebar = L.control.sidebar('leftSidebar', {
          position: 'left'
        });

        mymap.addControl(leftSidebar);

        var rightSidebar = L.control.sidebar('rightSidebar', {
          position: 'right',
          autoPan: false,
          closeButton: false
        });

        var zoomHome = L.Control.zoomHome();
        zoomHome.addTo(mymap)

        mymap.addControl(rightSidebar);
        rightSidebar.hide();

        var stripes = new L.StripePattern({
          color: 'rgba(255, 255, 255, 0.44)',
          opacity: .3,
          spaceWeight: .5,
          weight: 1
        });
        stripes.addTo(mymap);

        mymap.spin(true, spinnerSettings);
        mymap.createPane('allLayersPane');
        mymap.createPane('historyPane');
        mymap.createPane('historyStyleOverlay');
        // mymap.createPane('backgroundPane')

        mymap.getPane('allLayersPane').style.zIndex = 500;
        mymap.getPane('allLayersPane').style.opacity = 0;

        mymap.getPane('historyPane').style.zIndex = 0;
        mymap.getPane('historyPane').style.opacity = 0;
        mymap.getPane('historyStyleOverlay').style.zIndex = 0;
        mymap.getPane('historyStyleOverlay').style.opacity = 0;
        mymap.getPane('historyStyleOverlay').style.filter = "blur(3px)";
        mymap.getPane('historyStyleOverlay').style.mixblendmode = 'overlay';


        //ADD MAP LAYERS
        L.tileLayer.provider('CartoDB.DarkMatter').addTo(mymap);

        L.topoJson = function(data, options) {
          return new L.TopoJSON(data, options);
        };

        raleighLimitsLayer = L.topoJson(null, {
          style: {
            fillOpacity: 1,
            fillPattern: stripes,
            weight: 1,
            color: '#ffffff',
            opacity: .5,
            fillOpacity: .5
          }
        }).addTo(mymap);

        var raleighLimitsBounds = raleighLimitsLayer.getBounds();

        async function getGeoData(url) {
          let response = await fetch(url);
          let data = await response.json();
          return data;
        }

        getGeoData(raleighLimitsLayerData).then(data => raleighLimitsLayer.addData(data));

        majorHighwaysLayer = L.topoJson(null, {
          style: {
            fillOpacity: 1,
            fillPattern: stripes,
            weight: 1,
            opacity: .2,
            color: '#ffffff'
          },
          pane: 'highwaysPane'
        }).addTo(mymap);

        getGeoData(majorHighwaysData).then(data => raleighLimitsLayer.addData(data));

        function addpopup(feature, mycontent) {
            var myid = "thismarker";
            feature.bindPopup("<div id='"+myid+"'>" + mycontent + "</div>",
              {maxWidth: "auto"});
            mymap.on("popupopen", function(e){
                $("#"+myid+" img").one("load", function(){ e.popup.update(); });
            });
        }

        historicSubDivsLayer = L.topoJson(null, {
          style: {
            color: "#ffe536",
            fillOpacity: 1,
            fillColor: '#ffd567',
            weight: .1
          },
          pane: 'historyPane',
          onEachFeature: function(feature, layer){
            var subDivNameProperty = feature.properties.NAME;
            let yrApproved = feature.properties.YRAPPROV;
            let historyObjecTry2 = getHistoryObject(feature.properties.NAME, historyData);
            let popUpImageLink = historyObjecTry2.Image_1_Link;
            let content =
            '<div class = "histPopUpContainer">' +

              '<h1 id = "histPopUpHeader" class = "popUpHeader">' + subDivNameProperty + '<p class = "histEstDate" >' + 'est: ' + yrApproved + '</p>' +
              '</h1>' +
                '<button class = "popUpHistLink" id = "historyLink" onclick = "toggleLeftSidebar()" >' + "VIEW HISTORY>>>" + '</button>' +
                '<div id = "testImgHolderDiv">'+'<img class = "popUpImage" id =  "popUpHistImg" src =' + popUpImageLink + '>' + '</div>'
            '</div>'
            addpopup(layer, content)

            layer.on('mouseover', function(e){
              this.setStyle(emptyStyle);
            });
            layer.on('mouseout', function(e){
              this.setStyle({'color': "#ffe536", 'fillOpacity': 1,'fillColor': '#ffd567'});
            })
            layer.on('click', function(e){
              mymap.setView(e.latlng, 12.5)
              let historyObjecTry2 = getHistoryObject(e.target.feature.properties.NAME, historyData);
              let thePopUp = e.target.getPopup();
              if (curActiveFeature !== e.target.feature){
                console.log('different feature got cliked');
              }
              curActiveFeature = e.target.feature;
              curActivePopUp = thePopUp;

              if (typeof historyObjecTry2 !== 'undefined'){
                subDivHasHistoryEntry = true;
                setLeftSidebarContent(historyObjecTry2);

            } else {
                subDivHasHistoryEntry = false;
              }
            })

          }
        }).addTo(mymap);

        var historicSubDivsBounds = historicSubDivsLayer.getBounds();

        getGeoData(historicSubDivsData).then(data => historicSubDivsLayer.addData(data));

        historicStyleLayer = L.topoJson(null, {
          style: {
            color: "#ffe536",
            fillOpacity: 1,
            fillColor: '#ffffff',
            weight: .1
          },
          pane: 'historyStyleOverlay',

        }).addTo(mymap);

        function changeCloseButton(){
          let buttonCol = document.getElementsByClassName('leaflet-popup-close-button');
          console.log(buttonCol);
          let butt = buttonCol[0];
          butt.style.top = "22px"
        }

        getGeoData(historicSubDivsData).then(data => historicStyleLayer.addData(data));

        subdivisionsLayer = L.topoJson(null, {

          pane: 'allLayersPane',
          style: subdivisionDefaultStyle,
          offset: (0, -100),
          onEachFeature: function(feature, layer) {
            let initialData = getAllNeighborHoodDataForYear(feature)
            let formattedHousePrice = formatPriceVal(initialData.medianHPrice)
            let popUpHTMLContent = generatePopUpHTMLContentString(feature.properties.NAME, currentYear, initialData.medianPrSqFt, formatPriceVal(initialData.medianHPrice), initialData.subDivAge, initialData.medianHage)


            layer.bindPopup(chart(feature, popUpHTMLContent));

            layer.on('mouseover', function(e) {
                this.setStyle(subdivisionHoverStyle);
            });

            layer.on('mouseout', function(e) {

              if(allInactive == false && inHistoricView == false && curActiveKey !== null){
                let property = curActiveKey.varKey.propertyName;
                let colorToChange = checkValues(this.feature.properties[property], curSoloObjs, nonActiveStyle.color, curActiveKey.varKey.shouldLocalString)
                let styleToChangeTo = subdivisionDefaultStyle;

                styleToChangeTo.color = colorToChange
                  this.setStyle(styleToChangeTo);
              } else {
                this.setStyle(emptyStyle)
              }


            });
            layer.on('click', function(e) {
              this.setStyle(subdivisionClickStyle);
            });

            layer.on('click', function(e) {
              if (curActiveFeature !== e.target.feature) {
              }
              curActiveFeature = this.feature;
              curActivePopUp = e.target.getPopup()
              let dataForYear = getAllNeighborHoodDataForYear(this.feature);
              let popUpHTMLContent = generatePopUpHTMLContentString(feature.properties.NAME, currentYear, dataForYear.medianPrSqFt, formatPriceVal(dataForYear.medianHPrice), dataForYear.subDivAge, dataForYear.medianHage)
              let toSet = chart(curActiveFeature, popUpHTMLContent)
              curActivePopUp.setContent(toSet)
            });

          }
        }).addTo(mymap);

        function generatePopUpHTMLContentString(featureName, yearForPopUp, medianPricePerSquareFoot, medianHomePrice, subDivisionsAge, medianHouseAge){
            let content = '<h1 class="popUpHeader" id="popUpHeader">' + featureName + '<i id = "popUpYearIndicactor" >' + ' - ' + yearForPopUp + '</i>' + '</h1>' +

              '<table class="myTable" id="styleReferenceTable">'+
                '<tr>'+
                  '<td class="popUpTableVariableName" id="medianPrSqFt_popUpData">'+'Median Price Per Square Foot: ' + "$" +medianPricePerSquareFoot+ "/ft" + "<sup>2</sup>" +'</td>'+
                '</tr>'+
                '<tr>'+
                  '<td class="popUpTableVariableName" id="medianHPrice_popUpData">' + 'Median Home Price: ' + "$" + medianHomePrice + '</td>'+
                '</tr>'+
                  '<tr>'+
                    '<td class="popUpTableVariableName" id="subDivAge_popUpData">'+'Subdivision Age: '+subDivisionsAge+'</td>'+
                '</tr>' +
                  '<tr>' +
                    '<td class="popUpTableVariableName" id="medianHage_popUpData">'+'Median House Age: ' + medianHouseAge+'</td>'+
                  '</tr>'+
                '</table>'
            return content;

        }

        getGeoData(subdivisionData).then(data=> subdivisionsLayer.addData(data))

        let historyButton = document.getElementById('showHistoryButton');

        historyButton.addEventListener("click", showHistorySubDivsGeoJSON)

        allDivKeyObjects = appendLegendKeys("dataVariableRight", mPrSqFtKey, allKeys, allDivKeyObjects);

        function deActivateCheckBoxes(){
          let checkboxes = document.getElementsByClassName('keyButton');
          for (var i = 0; i < checkboxes.length; i++) {
            let curCheckBox = checkboxes[i]
            curCheckBox.removeEventListener("click", handleLegendKeyToggle)
          }
        }

        function activateCheckBoxes(){
          let checkboxes = document.getElementsByClassName('keyButton');
          for (var i = 0; i < checkboxes.length; i++) {
            let curCheckBox = checkboxes[i]
            curCheckBox.addEventListener("click", handleLegendKeyToggle)
          }
        }

        //LAYER FUNCTIONS
        function onTopoLoad() {
          document.getElementById("leftSidebar").style.display = 'initial';
          document.getElementById('rightSidebar').style.display = 'block';
          mymap.spin(false);
          mymap.scrollWheelZoom.enable();
          mymap.dragging.enable();
          loaded = true;
          rightSidebar.show();
          L.control.layers().addTo(mymap);
          historicSubDivsBounds = historicSubDivsLayer.getBounds();
          raleighLimitsBounds = raleighLimitsLayer.getBounds();
          console.log("NUMBER OF SUBDIV FEATURES: "+subdivisionsLayer.getLayers().length);
          historicSubDivsLayer.setInteractive(false)
          setTimeout(function() {mymap.getPane('allLayersPane').style.opacity = .8});
        }

        //VARIABLE CONSTRUCTION
        $("#showHistoryButton").click(function(event) {
              $('#histButtonIcon').toggleClass('fa-eye-slash');
          });

        setDownloadButtonActivation('deactive')

        function deActivateLegend(){
            let deActivColor = 'rgb(37, 37, 37)'

            let myLegendrows = document.getElementsByClassName('dataVariableRight')
            for (var i = 0; i < myLegendrows.length; i++) {
              let curLegendRow = myLegendrows[i]
              let curLegendDataCol = curLegendRow.getElementsByTagName('td');
              console.log(curLegendDataCol);
            getElemSetStyle('yearDisplay', 'color', deActivColor)
            getElemSetStyle('prevYearArrow', 'color', deActivColor)
            getElemSetStyle('nextYearArrow', 'color', deActivColor)
            let myDataNames = document.getElementsByClassName('keyIdNameParagraph');
            for (var i = 0; i < myDataNames.length; i++) {
              let curDataName = myDataNames[i]
              curDataName.style.color = deActivColor;
            }
            setStyleForClass('keyButton', 'borderColor', deActivColor);
            setStyleForClass('keyButton', 'backgroundColor', deActivColor);

            let myColorRows = document.getElementsByClassName('colorBlockRow')
            for (var i = 0; i < myColorRows.length; i++) {
              let curColorRow = myColorRows[i]
              let colBlocks = curColorRow.getElementsByTagName('td');
              for (var j = 0; j < colBlocks.length; j++) {
                let curColBlock = colBlocks[j]
                curColBlock.style.backgroundColor = deActivColor
              }
            }
            let myValueRows = document.getElementsByClassName('colorValuesRow')
            for (var i = 0; i < myValueRows.length; i++) {
              let curValRow = myValueRows[i]
              let valBlocks = curValRow.getElementsByTagName('td');
              for (var j = 0; j < valBlocks.length; j++) {
                let curValBlock = valBlocks[j]
                curValBlock.style.color = deActivColor
              }
            }
          }
        }

        function fadeMapPanes(inout){
         if (inout === 'in') {
           mymap.getPane('historyPane').style.opacity = 1;
           mymap.getPane('allLayersPane').style.opacity = .1;
           mymap.getPane('historyPane').style.zIndex = 2000;
           mymap.getPane('historyStyleOverlay').style.opacity = 1;
           mymap.getPane('historyStyleOverlay').style.zIndex = 1000;

         }
         if (inout === "out"){
           mymap.getPane('allLayersPane').style.opacity = 1;
           mymap.getPane('historyPane').style.opacity = 0;
           mymap.getPane('historyPane').style.zIndex = 0;
           mymap.getPane('historyStyleOverlay').style.zIndex = 0;
           mymap.getPane('historyStyleOverlay').style.opacity = 0;
         }

        }

        function showHistorySubDivsGeoJSON(e) {
          let myCheckboxes
          let myRightSidebar = document.getElementById('rightSidebar')
          console.log(myRightSidebar);

          if (allInactive == false && curActiveKey !== null){
            console.log(curActiveKey);
            deactivateKey(curActiveKey);
          }
          deActivateYearSelector();
          curActiveKey = null;

          let histButton = e.target;
          if (inHistoricView == false) {
            getElemSetStyle('rightSidebar', 'transform', 'translate(0px,-784px)')
            historicSubDivsLayer.setInteractive(true)
            let paneCol = document.getElementsByClassName('leaflet-popup-pane')
            let paneToChange = paneCol[0];
            paneToChange.style.zIndex = 3000;
            fadeMapPanes('in')
            subdivisionsLayer.setStyle(emptyStyle)
            mymap.fitBounds(historicSubDivsBounds, {padding: [100, 100]})
            inHistoricView = true;
            getElemSetAttr("histButtonText", "innerHTML", "RETURN TO DATA VIEW")
            subdivisionsLayer.setInteractive(false)
            subdivisionsLayer.off('click');
            getElemSetStyle("historyToolTip", "display", "block");
            return;
          }
          if (inHistoricView == true) {
            getElemSetStyle('rightSidebar', 'transform', 'translate(0px,0px)')
            subdivisionsLayer.setInteractive(true)
            historicSubDivsLayer.setInteractive(false)
            mymap.fitBounds(raleighLimitsBounds, {padding: [100, 100]})
            fadeMapPanes('out')
            inHistoricView = false;
            getElemSetAttr("histButtonText", "innerHTML", "VIEW NEIGHBORHOOD HISTORIES")
            getElemSetStyle("historyToolTip", "display", "none");
            deActivateAllKeys();
            mymap.closePopup();
            if (leftSidebar.isVisible() == true){
              leftSidebar.toggle();
            }
            return;
          }
        }

        function makeKey(propName, fullName, min, max, colors, units, intervalPrefix, shouldLocalString) {
          let keyToReturn = {
            "propertyName": propName,
            "fullVariableName": fullName,
            "intervals": createIntervalArrayFromMinMaxValue(min, max, colors.length),
            "colors": colors,
            "units": units,
            "intervalPrefix": intervalPrefix,
            "shouldLocalString": shouldLocalString
          }
          return keyToReturn;
        }

        //YEAR DISPLAY FUNCTIONS

        function decrementYear(){
            if (activeYearIndex >= 1 ){
              activeYearIndex = activeYearIndex - 1;
              yearDisp.innerHTML = yearsForData[activeYearIndex]
            }
            yearInBoundsBool()
            updateSelectedYearIndicatorDisplay();
          }

        function incrementYear(){
            activateArrow(prevArrow, "prev")
            if (activeYearIndex < yearsForData.length){
              activeYearIndex = activeYearIndex + 1
              yearDisp.innerHTML = yearsForData[activeYearIndex]
              }
            yearInBoundsBool()
            updateSelectedYearIndicatorDisplay();
          }

        function yearInBoundsBool(){
          if (activeYearIndex == 0){
            console.log(currentYear);
            setYearInnerHTMLUpdateMapColors()
            deActivateArrow(prevArrow, 'prev')
            activateArrow(nextArrow, 'next')
            return
          }
          if (activeYearIndex == 4){
            setYearInnerHTMLUpdateMapColors()
            deActivateArrow(nextArrow, 'next')
            activateArrow(prevArrow, 'prev')
            return
          }
          if (activeYearIndex !== 0){
            activateArrow(prevArrow, 'prev')

          }
          if (activeYearIndex !== yearsForData.length){
            activateArrow(nextArrow, 'next')

          }

        }

        function setYearInnerHTMLUpdateMapColors(){

          currentYear = yearDisp.innerHTML
                console.log(currentYear);
          let propNameAndYear = curActiveKey.varKey.propertyName + currentYear;
          let rootPropName = curActiveKey.varKey.propertyName.split('_')[0];

          let activePropYear =  rootPropName + "_" + currentYear;
          if (loaded == true){
            console.log(activePropYear);
            setMapColors(activePropYear, curActiveKey.varKey, subdivisionsLayer);

          }
          if (typeof curActiveFeature !== 'undefined' ){
                setPopUpDynamicContent(curActivePopUp, curActiveFeature)
            }
        }

        function updateSelectedYearIndicatorDisplay(){
           for (var i = 0; i < indicatorSet.length; i++) {
             let toCheck = indicatorSet[i];

             if (activeYearIndex == i){
               toCheck.style.backgroundColor =  activeColor
               yearDisp.color = activeColor
             } else {
               toCheck.style.backgroundColor = 'rgb(152, 152, 152)';
             }
           }
         }

        function activateYearSelector(){
           getElemSetStyle('yearChanger', 'backgroundColor', 'rgb(64, 64, 64)')
           prevArrow.style.color = 'rgb(255, 255, 255)'
           nextArrow.style.color = 'rgb(255, 255, 255)'
           yearDisp.style.color = 'rgb(255, 255, 255)'

           prevArrow.style.cursor = 'pointer'
           nextArrow.style.cursor = 'pointer'

           activateArrow(prevArrow, "prev")
           activateArrow(nextArrow, "next");


           let indictSquares = document.getElementsByClassName('dateSelectionIndex')
           for (var i = 0; i < indictSquares.length; i++) {
             let curSquare = indictSquares[i];
             curSquare.style.backgroundColor = 'rgb(154, 154, 154)';


             $(curSquare).on('mouseover',function(){
                let fullid  = this.id
                let idNum = fullid.split("_")[1]
                 if (parseInt(idNum) !== parseInt(activeYearIndex) ) {
                   $(curSquare).on('mouseover',function(){
                    if (parseInt(idNum) !== parseInt(activeYearIndex)) {
                       $(this).css('background-color', 'rgb(194, 194, 194)')
                     }
                   })
                   $(curSquare).on('mouseout',function(){
                     if (parseInt(idNum) !== parseInt(activeYearIndex)) {
                       $(this).css('background-color', 'rgb(154, 154, 154)')
                     }
                   })
                 } else {
                   $(curSquare).on('mouseover',function(){
                       $(this).css('background-color', activeColor)
                   })
                   $(curSquare).on('mouseout',function(){
                       $(this).css('background-color', activeColor)
                   })
                 }

              })

           }
           updateSelectedYearIndicatorDisplay();
         }

        function deActivateYearSelector(){

          getElemSetStyle('yearChanger', 'backgroundColor', 'rgb(0, 0, 0)')

          prevArrow.removeEventListener('click', decrementYear)
          prevArrow.removeEventListener('click', updateSelectedYearIndicatorDisplay)
          prevArrow.removeEventListener('click', setYearInnerHTMLUpdateMapColors)

          nextArrow.removeEventListener('click', decrementYear)
          nextArrow.removeEventListener('click', updateSelectedYearIndicatorDisplay)
          nextArrow.removeEventListener('click', setYearInnerHTMLUpdateMapColors)

          nextArrow.removeEventListener('mouseover', setArrowHovColorIn)
          nextArrow.removeEventListener('mouseout', setArrowHovColorOut)

          prevArrow.style.color = 'rgb(70, 70, 70)'
          nextArrow.style.color = 'rgb(70, 70, 70)'
          yearDisp.style.color = 'rgb(70, 70, 70)'

          prevArrow.style.cursor = 'default'
          nextArrow.style.cursor = 'default'

          let indictSquares = document.getElementsByClassName('dateSelectionIndex')

          for (var i = 0; i < indictSquares.length; i++) {

            let curSquare = indictSquares[i];
            $(curSquare).off('mouseover')
            $(curSquare).off('mouseout')
            if (i == activeYearIndex){
              curSquare.style.backgroundColor = 'rgb(101, 101, 101)';
            } else {
              curSquare.style.backgroundColor = 'rgb(70, 70, 70)';
            }
          }

        }

        function setDownloadButtonActivation(activedeactive){
          if (activedeactive == "active") {
            if (downloadHasBeenActivated == false) {
              console.log('added clikc to download');
              dataDownloadButton.addEventListener("click", function(e){
                saveToGeoJSONFile(downloadCollection)
              });
            }

            dataDownloadButton.style.color = 'rgb(255, 255, 255)'
            $("#dataDownloadButton").on('mouseover',function(){
                $(this).css('background-color', 'rgb(56, 56, 56)')
            })
            $("#dataDownloadButton").on('mouseout',function(){
                $(this).css('background-color', 'rgb(0, 0, 0)')
            })
            $("#dataDownloadButton").on('mousedown',function(){
                $(this).css('background-color', 'rgb(101, 101, 101)')
            })

          }
          if (activedeactive == "deactive") {
            console.log('download is deative');
            dataDownloadButton.removeEventListener("click", function(){
              saveToGeoJSONFile(downloadCollection, downloadFileName)
            });
            dataDownloadButton.style.color = 'rgb(162, 162, 162)'
            $("#dataDownloadButton").off('mouseover')
            $("#dataDownloadButton").off('mouseout')
            $("#dataDownloadButton").off('click')
          }
        }

        function activateArrow(arrowElem, dir){
              arrowElem.style.color = 'rgb(255, 255, 255)';
          if (dir === "prev") {
              arrowElem.addEventListener('click', decrementYear)
              arrowElem.addEventListener('click', updateSelectedYearIndicatorDisplay)
              arrowElem.addEventListener('click', setYearInnerHTMLUpdateMapColors)
              arrowElem.addEventListener('mouseover', setArrowHovColorIn)
              arrowElem.addEventListener('mouseout', setArrowHovColorOut)
              $(arrowElem).on('mousedown',function(){
                  $(this).css('color', 'rgb(101, 101, 101)')
              })
          }
          if (dir === "next"){
              arrowElem.addEventListener('click', incrementYear)
              arrowElem.addEventListener('click', updateSelectedYearIndicatorDisplay)
              arrowElem.addEventListener('click', setYearInnerHTMLUpdateMapColors)
              arrowElem.addEventListener('mouseover', setArrowHovColorIn)
              arrowElem.addEventListener('mouseout', setArrowHovColorOut)
              $(arrowElem).on('mousedown',function(){
                  $(this).css('color', 'rgb(101, 101, 101)')
              })
          }

        }

        function deActivateArrow(arrowElem, dir){
            arrowElem.style.color = 'rgb(31, 31, 31)';
          if (dir === "prev"){
            arrowElem.removeEventListener('click', decrementYear)
            arrowElem.removeEventListener('click', updateSelectedYearIndicatorDisplay)
            arrowElem.removeEventListener('click', setYearInnerHTMLUpdateMapColors)
            arrowElem.removeEventListener('mouseover', setArrowHovColorIn)
            arrowElem.removeEventListener('mouseout', setArrowHovColorOut)
            $(arrowElem).off('mousedown',function(){
                $(this).css('color', 'rgb(101, 101, 101)')
            })
          }
          if (dir === "next"){
            arrowElem.removeEventListener('click', incrementYear)
            arrowElem.removeEventListener('click', updateSelectedYearIndicatorDisplay)
            arrowElem.removeEventListener('click', setYearInnerHTMLUpdateMapColors)
            arrowElem.removeEventListener('mouseover', setArrowHovColorIn)
            arrowElem.removeEventListener('mouseout', setArrowHovColorOut)
            $(arrowElem).off('mousedown',function(){
                $(this).css('color', 'rgb(101, 101, 101)')
            })
          }
        }

        function setArrowHovColorIn(e){
          e.target.style.color = 'rgb(88, 88, 88)';
        }

        function setArrowHovColorOut(e){
          e.target.style.color = 'rgb(255, 255, 255)';
        }

        function setFromSquares(elem){
          let id = elem.getAttribute('id')
          let yrIndexToGet = id.split('_')[1]
          let yrToGet = yearsForData[yrIndexToGet]
          activeYearIndex = yrIndexToGet
          updateSelectedYearIndicatorDisplay()
          yearDisp.innerHTML = yrToGet
          setYearInnerHTMLUpdateMapColors();
          yearInBoundsBool();
        }

        //KEY GENERATION

        function generateColBlocksHTML(colRow, colors) {
          let colBlocksSet = [];;
          for (i = 0; i < colors.length; i++) {
            let colBlock = document.createElement('td');
            colBlock.setAttribute('class', "colorid1");
            colBlock.setAttribute('index', i)
            colRow.appendChild(colBlock);
            colBlocksSet.push(colBlock);
          }
          return colBlocksSet;
        }

        function generateValBlocksHTML(valRow, colors) {
          let valBlocksSet = [];
          for (i = 0; i < colors.length; i++) {
            let valBlock = document.createElement('td');
            valBlock.setAttribute('class', "colorValue");
            valRow.appendChild(valBlock);
            valBlocksSet.push(valBlock);
          }
          return valBlocksSet;
        }

        function generateToggleHTML(parent, id, index){
          let label = createClassIdAppend(parent, 'label', 'form-switch', 'aa')
          let input = createClassIdAppend(label, 'INPUT', 'keyButton', 'aaa')
          input.setAttribute('type', 'checkbox');
          input.setAttribute('ind', index);


          let icon = createClassIdAppend(label, 'i', 'aaff', id)
          let iconButton = createClassIdAppend(icon, 'div', 'roundToggleButton', 'kajsdfklds')
          input.addEventListener("click", handleLegendKeyToggle)
          let keyButton = {
            'label': label,
            'input': input,
            'icon': icon,
            'buttonIcon': iconButton
          }
          return keyButton;
          }

        function generateKeyHTMLObj(keyMastParent, key, testTest) {
          keyMastParent.setAttribute('class', 'dataVariableRight');
          keyMastParent.setAttribute('id', key.fullVariableName + "_legendRow");
          let varName = key.fullVariableName;
          let rowContainer = createClassIdAppend(keyMastParent, 'div', 'switchNameHolderDiv', varName + "_holder");
          let checkBox = generateToggleHTML(rowContainer, varName + "_button", testTest)

          let rowParagraph = createClassIdAppend(rowContainer, "P", "keyIdNameParagraph", varName + "_paragraph");

          let rowParent = createClassIdAppend(keyMastParent, "TABLE", "legendTable", varName + "_rowParent");
          let colorRow = createClassIdAppend(rowParent, "tr", "colorBlockRow", varName + "_colorRow");
          let valueRow = createClassIdAppend(rowParent, "tr", "colorValuesRow", varName + "_colorValueRow");
          checkBox.icon.addEventListener("click", handleLegendKeyToggle)
          let colBlocks = generateColBlocksHTML(colorRow, key.colors);
          let valBlocks = generateValBlocksHTML(valueRow, key.colors);
          let keyHTMLObj = {
            "rowContainer": rowContainer,
            "varKey": key,
            "keyButton": checkBox.icon,
            "toggleIconButton": checkBox.buttonIcon,
            "keyRow": keyMastParent,
            "keyParagraph": rowParagraph,
            "keyColorRow": colorRow,
            "keyColorBlocks": colBlocks,
            "keyValueRow": valueRow,
            "keyValueBlocks": valBlocks,
            "initialDisplay": false,
            "active": false
          }

          return keyHTMLObj;
        }

        function populateUniqueLegendKeyContent(keyObj) {
          let keyTitle = keyObj.keyParagraph;
          keyTitle.innerHTML = keyObj.varKey.fullVariableName + " " + "(" + keyObj.varKey.units + ")";

          populateRowColors(keyObj.keyColorBlocks, keyObj.varKey.colors);
          setKeyValuesInnerHTML(keyObj.keyValueBlocks, keyObj.varKey.intervals, keyObj.varKey.intervalPrefix);
        }

        function createIntervalArrayFromMinMaxValue(min, max, number) {
          let inc = (max - min) / number;
          let incrementSet = [];
          for (i = 0; i < number; i++) {
            if (i === 1) {
              start = min;
            }
            let end = Math.round(min + ((i + 1) * inc));
            let realEnd = formatPriceVal(end)
            start = formatPriceVal(Math.floor((end - inc) + 1));

            let intervalPair = [start, realEnd]
            incrementSet.push(intervalPair);
            if (i > 1) {
              let current = incrementSet[i];
              let previous = incrementSet[i - 1];
              if (current[0] === previous[1]) {
                current[0] = current[0] + 1;
              }
            }
          }
          return incrementSet;
        }

        function populateRowColors(colBlocks, keyObjColors) {
          for (i = 0; i < colBlocks.length; i++) {
            let blockToGet = colBlocks[i];
            blockToGet.style.backgroundColor = keyObjColors[i];
          }
        }

        function setKeyValuesInnerHTML(valBlocks, keyObjIntervals, prefix) {
          for (i = 0; i < keyObjIntervals.length; i++) {
            let valToGet = valBlocks[i];
            let start = keyObjIntervals[i];
            valToGet.innerHTML = prefix + start[0].toString() + '-' + start[1];

          }
        }

        function appendLegendKeys(classToAppendTo, initialKey, allOfKeys, allHTMLKeys) {
          allHTMLKeys = [];
          let colorKey = initialKey.colors;
          let parentElements = document.getElementsByClassName(classToAppendTo);
          for (q = 0; q < parentElements.length; q++) {
            let keyHTMLToAppend = generateKeyHTMLObj(parentElements[q], allOfKeys[q], q);
            allHTMLKeys.push(keyHTMLToAppend);
          }
          for (l = 0; l < allHTMLKeys.length; l++) {
            populateUniqueLegendKeyContent(allHTMLKeys[l]);
            deactivateKey(allHTMLKeys[l]);
            deActivateYearSelector();
          }

          return allHTMLKeys;
        }

        function colorizeRow(aColorRowId, aColorKey) {
          let blocksInColorRow = document.getElementById(aColorRowId).children;
          for (i = 0; i < blocksInColorRow.length; i++) {
            blocksInColorRow[i].style.backgroundColor = aColorKey[i];
          }
        }

        function deActivateAllKeys(){
          for (var i = 0; i < allDivKeyObjects.length; i++) {
            let curKey = allDivKeyObjects[i]
            deactivateKey(curKey)
          }
          let boxCol = document.getElementsByClassName('keyButton')
          for (var i = 0; i < boxCol.length; i++) {
            let curBox =  boxCol[i]
            curBox.style.borderColor = 'rgb(162, 162, 162)';
          }
        }

        //KEY INTERACTION
        function handleLegendKeyToggle(e) {

          allInactive = checkIfAllKeysInactive();
          downloadCollection.features = [];
          let indexOfClickedButton = e.target.getAttribute('ind')
          let clickedKeyDivObj = allDivKeyObjects[indexOfClickedButton]
          allInactive = deactivateKeyOnSecondClick(clickedKeyDivObj, allDivKeyObjects);
          if (allInactive == true){
            deActivateYearSelector();
            downloadHasBeenActivated = false;
            setDownloadButtonActivation('deactive')
            subdivisionsLayer.setStyle(emptyStyle)
            curSoloObjs = []
          }
          if (allInactive == false){
            setDownloadButtonActivation("active")
            downloadHasBeenActivated = true;
            activateYearSelector();
            subdivisionsLayer.setStyle(subdivisionDefaultStyle)
            curSoloObjs = clickedKeyDivObj.keyColorBlocks.map(x => createSoloObjs(clickedKeyDivObj, x))
            setMapColors(clickedKeyDivObj.varKey.propertyName, clickedKeyDivObj.varKey, subdivisionsLayer);

          }
          if (activeYearIndex == 0){
            getElemSetStyle('prevYearArrow', 'color', 'rgb(31, 31, 31)')
          }
          if (activeYearIndex == (yearsForData.length -1)){
            getElemSetStyle('nextYearArrow', 'color', 'rgb(31, 31, 31)')
          }
          curActiveKey = clickedKeyDivObj;
          console.log(curSoloObjs);
        }

        function checkIfAllKeysInactive(){
         let inactiveKeys = 0;
         for (var i = 0; i < allDivKeyObjects.length; i++) {
           let activeStatus = false;
           let curKey = allDivKeyObjects[i];
           if (curKey.active == false) {
             inactiveKeys = inactiveKeys + 1;
           }
          }
          if (inactiveKeys == allDivKeyObjects.length){
            activeStatus = true;
            return activeStatus;

          } else {
            activeStatus = false;
            return activeStatus;
          }

        }

        function deactivateKey(keyObj){

          keyObj.keyParagraph.style.color = 'rgb(162, 162, 162)';
          keyObj.toggleIconButton.style.transform = 'translate3d(2px, 2px, 0px)'
          keyObj.keyButton.style.backgroundColor = 'rgb(162, 162, 162)';
          keyObj.keyRow.style.backgroundColor = 'rgb(0, 0, 0)'
          let theKeyValues = keyObj.keyValueBlocks
          for (var i = 0; i < theKeyValues.length; i++) {
            let curVal = theKeyValues[i];
            curVal.style.color = 'rgb(162, 162, 162)';
          }
          let colBlocks = keyObj.keyColorBlocks;

          populateRowColors(colBlocks, mydefaultKeyColorSet);
          setColorBlockActivation(colBlocks,'deactive')
        }

        function activateKey(keyObj){
            if (typeof keyObj === 'undefined') {
              console.log('it was undefined');
            }
          if (typeof keyObj !== undefined) {
            keyObj.active = true;
            keyObj.initialDisplay = true;
            keyObj.keyParagraph.style.color = 'rgb(255, 255, 255)';
            activeColor = keyObj.varKey.colors[1]
            keyObj.keyButton.style.backgroundColor =  keyObj.varKey.colors[1]
            let button = keyObj.keyButton
            let dispIndicator = keyObj.toggleIconButton
            dispIndicator.style.transform = 'translate3d(22px, 2px, 0px)'
            keyObj.keyRow.style.backgroundColor = 'rgb(64, 64, 64)'

            populateRowColors(keyObj.keyColorBlocks, keyObj.varKey.colors);
            let theKeyValues = keyObj.keyValueBlocks
            for (var i = 0; i < theKeyValues.length; i++) {
              let curVal = theKeyValues[i];
              curVal.style.color = 'rgb(255, 255, 255)';
            }
            setColorBlockActivation(keyObj.keyColorBlocks, 'active')
          }
        }

        function setColorBlockActivation(colBlocks, activeDeactive){
          if (activeDeactive == "active") {
            for (var i = 0; i < colBlocks.length; i++) {
              let curBlock = colBlocks[i]
              curBlock.addEventListener('click', soloColorValue)
              $(curBlock).on('mouseover', function(){
                $(this).css({
                  '-moz-box-shadow': '0px 0px 4px #ffffff',
                  '-webkit-box-shadow': '0px 0px 4px #ffffff',
                  'box-shadow': '0px 0px 4px #ffffff',
                })
              })
              $(curBlock).on('mouseout', function(){
                $(this).css({
                  '-moz-box-shadow': 'none',
                  '-webkit-box-shadow': 'none',
                  'box-shadow': 'none',
                })
              })
            }
          }
          if (activeDeactive == "deactive") {
            for (var i = 0; i < colBlocks.length; i++) {
              let curBlock = colBlocks[i]
              curBlock.removeEventListener('click', soloColorValue)
              $(curBlock).off('mouseover')
              $(curBlock).off('mouseout')
            }
          }
        }

        function soloColorRowControl(soloObjs, colBlocks, activeColorSet) {
          let activeIndexes =  soloObjs.map(a => a.soloIndex);
          let defAr = [0,1,2,3,4]

          let diff = arr_diff(defAr, activeIndexes)
          for (var j = 0; j < activeIndexes.length; j++) {
            let blockToActivate = colBlocks[activeIndexes[j]]
            let activateCol = activeColorSet[activeIndexes[j]]
            blockToActivate.style.backgroundColor = activateCol
          }
          for (var i = 0; i < diff.length; i++) {
            let blockToDeactivate = colBlocks[diff[i]]
            let deactivCol = mydefaultKeyColorSet[diff[i]]
            blockToDeactivate.style.backgroundColor = deactivCol
          }
        }

        function removeFromArayViaProperty(obj, objArray, property){
          for(var i=0 ; i<objArray.length; i++)
              {
                let curObj = objArray[i]
                if(curObj[property]== obj[property])
                objArray.splice(i);
              }
        }

        function checkIfIndexSolo(index, curActi){
          let soloIndexes = curSoloObjs.map(a => a.soloIndex);
          for (var i = 0; i < soloIndexes.length; i++) {
              let aActiveSoloIndex = soloIndexes[i];
              if (index == aActiveSoloIndex) {
                return true;
              }
          }
          return false;
        }

        function createSoloObjs(key, colBlockElem){
          let soloElem = colBlockElem
          let blockIndex = colBlockElem.getAttribute('index')

          let soloIndex = parseInt(blockIndex)
          let soloRange = key.varKey.intervals[blockIndex]
          let soloCol = key.varKey.colors[blockIndex]
          let soloObj = {
            "soloElem": soloElem,
            "soloIndex": soloIndex,
            "soloRange": soloRange,
            "soloCol": soloCol
          }
          return soloObj;
        }

        function soloColorValue(e){
          let rootPropName = curActiveKey.varKey.propertyName.split('_')[0];
          let activePropYear =  rootPropName + "_" + currentYear;
          let selectedIndex = e.target.getAttribute('index');
          let soloObj = createSoloObjs(curActiveKey, e.target)

          let isActive = inArray(soloObj, curSoloObjs)
          if (e.shiftKey !== true) {
            curSoloObjs = [];
            curSoloObjs.push(soloObj)
          }
          if (isActive == true && curActiveKey.initialDisplay == false){
            removeFromArayViaProperty(soloObj, curSoloObjs, "soloIndex")
          }
          if (isActive == false && curActiveKey.initialDisplay == false && e.shiftKey == true) {
            curSoloObjs.push(soloObj)
          }
          if (isActive == true && curActiveKey.initialDisplay == false && e.shifzzagasdgtKey == true) {
            removeFromArayViaProperty(soloObj, curSoloObjs, "soloIndex")
          }
          if (curSoloObjs.length == 0){
            curSoloObjs = curActiveKey.keyColorBlocks.map(x => createSoloObjs(curActiveKey, x))
            setMapColors(activePropYear, curActiveKey.varKey, subdivisionsLayer);

            colorizeRow(curActiveKey.varKey.fullVariableName+"_colorRow", curActiveKey.varKey.colors)

          }
          soloColorRowControl(curSoloObjs, curActiveKey.keyColorBlocks, curActiveKey.varKey.colors)

            subdivisionsLayer.eachLayer(function(layer) {
              let myColor = checkValues(layer.feature.properties[activePropYear], curSoloObjs, nonActiveStyle.color, curActiveKey.varKey.shouldLocalString)
              let toChangeTo = subdivisionDefaultStyle;
              toChangeTo['color']  = myColor

              if (toChangeTo === 'void'){
                layer.setStyle(emptyStyle)
              }
              layer.setStyle(toChangeTo)
              if (toChangeTo.color === nonActiveStyle.color || toChangeTo.color === emptyStyle.color) {
                nonActiveStyle.fillOpacity = .6
                layer.setStyle(nonActiveStyle)
                layer.setInteractive(false)
              } else {
                let geojsonToAdd = layer.toGeoJSON();
                layer.setInteractive(true)

                downloadCollection.features.push(geojsonToAdd)
              }


            })
          curActiveKey.initialDisplay = false;
        }



        //DATA
        function checkValues(featurePropVal, soloObjs, noSoloStyle, shouldRemoveCommas){
          let col = 0;
          let colors = soloObjs.map(a => a.soloCol);
          let intervals = soloObjs.map(a => a.soloRange);
          if (shouldRemoveCommas == true) {
              for (var i = 0; i < intervals.length; i++) {
                let curInterval = intervals[i]
                convertedInterval = curInterval.map(function(x){
                  return x.replace(',','')
                })
                intervals[i] = convertedInterval
              }
              featurePropVal = Number(featurePropVal.replace(',', ''));
          }
          if (intervals.length == 1) {
            col = checkIfInBetween(featurePropVal, intervals[0]) ? colors[0] :
                  noSoloStyle
            return col;
          }
          if (intervals.length == 2) {
            col = checkIfInBetween(featurePropVal, intervals[0]) ? colors[0] :
                  checkIfInBetween(featurePropVal, intervals[1]) ? colors[1] :
                  noSoloStyle
            return col;
          }
          if (intervals.length == 3) {
            col = checkIfInBetween(featurePropVal, intervals[0]) ? colors[0] :
                  checkIfInBetween(featurePropVal, intervals[1]) ? colors[1] :
                  checkIfInBetween(featurePropVal, intervals[2]) ? colors[2] :
                  noSoloStyle
            return col;
          }
          if (intervals.length == 4) {
            col = checkIfInBetween(featurePropVal, intervals[0]) ? colors[0] :
                  checkIfInBetween(featurePropVal, intervals[1]) ? colors[1] :
                  checkIfInBetween(featurePropVal, intervals[2]) ? colors[2] :
                  checkIfInBetween(featurePropVal, intervals[3]) ? colors[3] :
                  noSoloStyle
            return col;
          }
          if (intervals.length == 5) {
            col = checkIfInBetween(featurePropVal, intervals[0]) ? colors[0] :
                  checkIfInBetween(featurePropVal, intervals[1]) ? colors[1] :
                  checkIfInBetween(featurePropVal, intervals[2]) ? colors[2] :
                  checkIfInBetween(featurePropVal, intervals[3]) ? colors[3] :
                  checkIfInBetween(featurePropVal, intervals[4]) ? colors[4] :
                  noSoloStyle
            return col;
          }


        }

        function checkIfInBetween(val, interval){
          let min = interval[0]
          let max = interval[1]
          if (val >= parseInt(min) && val <= parseInt(max)){
            return true
          } else {
            return false
          }

        }

        function formatPriceVal(price){
          let convertedToNum = parseInt(price, 10);
          let formatted = convertedToNum.toLocaleString();
          return formatted;
        }

        function deleteObjProps(obj, probsToDelete){
          for ( j = 0; j < probsToDelete.length; j++) {
            let curToDelete = probsToDelete[j.toString()]
            delete obj[curToDelete]
          }
          return obj
        }

        function generateGeoJSONFileNameString(){
          let rootPropName = curActiveKey.varKey.propertyName.split('_')[0];
          let activePropYear =  rootPropName + "_" + currentYear;
          let intervals = curSoloObjs.interva
          let allCurRanges = []
          let dataStart = 0
          let dataEnd = 1
          for (var i = 0; i < curSoloObjs.length; i++) {
            let curRange = curSoloObjs[i].soloRange
            allCurRanges.push(curRange)

          }
          if (allCurRanges.length > 1 ){
             dataStart = allCurRanges[0][0]
             dataEnd = allCurRanges[allCurRanges.length-1][1]
          } else {
             dataStart = allCurRanges[0][0]
             dataEnd = allCurRanges[0][1]
          }
          let rangeString = [dataStart, dataEnd].join('_')
          let completeFileName = [activePropYear, rangeString].join('_')
          console.log(completeFileName);

        }

        function saveToGeoJSONFile(content, filename) {
          let rootPropName = curActiveKey.varKey.propertyName.split('_')[0];
          let activePropYear =  rootPropName + "_" + currentYear;

          let myActiveFeatures = {
              "type": "FeatureCollection",
              "features": []
          };

          generateGeoJSONFileNameString();

          let selectedFeatures = content.features
          let listOfAllPropertyNamest = Object.getOwnPropertyNames(content.features[0].properties)
          let toGetArray = ['NAME', 'medianHPrice_2000']

          let toDelete = arr_diff(toGetArray, listOfAllPropertyNamest)
          for (var i = 0; i < selectedFeatures.length; i++) {
            let curFeature = selectedFeatures[i];
            let g = curFeature.geometry;
            let target = {

            }
            let props = Object.assign(target, curFeature['properties'])
            let finalProps = deleteObjProps(props, toDelete)
            console.log('FINALPROPS', finalProps)

            myActiveFeatures.features.push({
              'type': "Feature",
              'geometry': g,
              'properties': finalProps
            })
          }

          var file = activePropYear + '.geojson';
          saveAs(new File([JSON.stringify(myActiveFeatures)], file, {
            type: "text/plain;charset=utf-8"
          }), file);


        }

        function deactivateKeyOnSecondClick(keyDivObj, keySet) {
          if (keyDivObj === curActiveKey && curActiveKey.active == true){
            console.log(curActiveKey);
            curActiveKey.active = false;
            subdivisionsLayer.setStyle(subdivisionDefaultStyle)
            curActiveKey = null;
            let yrTest = document.getElementById('yearDisplay');
            deactivateKey(keyDivObj)

            return true
          } else {
            for (var i = 0; i < keySet.length; i++) {
                let curKey = keySet[i];
                deactivateKey(curKey)
              }
            console.log('not same going to activate');
            if (typeof keyDivObj !== undefined) {
              activateKey(keyDivObj)
            }

            return false;
          }
        }

        function setMapColors(property, activeKey, layerName) {

         layerName.eachLayer(function(layer) {
                  let myColor = checkValues(layer.feature.properties[property], curSoloObjs, nonActiveStyle.color, activeKey.shouldLocalString)
                  let base = subdivisionDefaultStyle;
                  base.color = myColor
                  base.fillOpacity = .8
                  if (base.color === nonActiveStyle.color || base.color === emptyStyle.color) {
                    layer.setStyle(base);
                    layer.setInteractive(false)
                  } else {
                    layer.setStyle(base);
                    let geojsonToAdd = layer.toGeoJSON();
                    layer.setInteractive(true)

                    downloadCollection.features.push(geojsonToAdd)
                  }
                if (layer.feature.properties[property] == null || layer.feature.properties[property] === 'void') {
                  layer.setStyle(subdivisionDefaultStyle);
                  layer.setStyle(emptyStyle);
                }
              });
        }

        function setGeoJSONStyleFromProp(featurePropVal, theKey, baseStyle, solo, indexes) {
          if (theKey.shouldLocalString == true){
            featurePropVal = featurePropVal.replace(',', '');
          }
          featurePropVal = Number(featurePropVal);

          for (i = 0; i < 5; i++) {
            let intervalSet = theKey.intervals[i];
            let colorSet = theKey.colors;
            let min = intervalSet[0];
            let max = intervalSet[1];
            if(theKey.shouldLocalString){
              min = min.replace(',','');
              max = max.replace(',','');
            }
            let uniqueStyle = baseStyle;
            if (featurePropVal >= min && featurePropVal <= max) {

              uniqueStyle['color'] = colorSet[i];
              uniqueStyle['fillOpacity'] = 1;
              return uniqueStyle;
            }
          }
        }

        //MAP LAYER POP UP
        function generatePopUpStructure() {
          let popUpParent = createClassIdAppend('ignore', 'div', 'popUpConatiner')
          let popUpHeader = createClassIdAppend(popUpParent, 'H1', 'popUpHeader', 'popUpHeader')
          let prefixes = ["Median Price Per Square Foot: ", "Median Home Price: ", "Subdivision Age: ",  "Median House Age: "]
          let tableParent = createClassIdAppend(popUpParent, 'div','popUpTableContainer', 'popUpTable')
          let propertyDisplays = []
          let table = createClassIdAppend(tableParent, 'table', 'myTable', 'styleReferenceTable')
          for (var i = 0; i < allKeys.length; i++) {
            let curKey = allKeys[i];
            let row = createClassIdAppend(table, 'tr');
            let fullVarName = curKey.propertyName;
            let varName = fullVarName.split("_")[0]
            let rowContent = createClassIdAppend(row, 'td', 'popUpTableVariableName', varName)
            propertyDisplays.push(rowContent)

            rowContent.innerHTML = prefixes[i]
          }

          let popUpContentObj = {
            "subDivName": popUpHeader,
            "medianPrSqFt": propertyDisplays[0],
            "medianHPrice":propertyDisplays[1],
            "subDivAge": propertyDisplays[2],
            "medianHage": propertyDisplays[3]
          }
          let popUpGroup = {
            'popUpCol': popUpParent,
            'popUpObj': popUpContentObj
          }
          return popUpGroup;

        }

        function updatePopUpContents(e){
          changeCloseButton();
          let thePopUp = e.target.getPopup();
          setPopUpDynamicContent(thePopUp, e.target.feature)
          curActiveFeature = e.target.feature;
        }

        function setPopUpDynamicContent(somePopup, someFeature, somePopUpObj){
          let dataForYear = getAllNeighborHoodDataForYear(someFeature);
          let subDivNameProperty = someFeature.properties.NAME;
          let sqFtUnits = "<sup>2</sup>"
          let formattedHousePriceVal = formatPriceVal(dataForYear.medianHPrice);
          let prefixes = ["Median Price Per Square Foot: ", "Median Home Price: ", "Subdivision Age: ",  "Median House Age: "]
          getElemSetAttr('medianPrSqFt_popUpData', "innerHTML", "Median Price Per Square Foot: " + "$" + dataForYear.medianPrSqFt + "/ft"+sqFtUnits)
          getElemSetAttr('medianHPrice_popUpData', 'innerHTML',  "Median Home Price: " + "$" + formattedHousePriceVal)
          getElemSetAttr('subDivAge_popUpData', 'innerHTML', "Subdivision Age: " + dataForYear.subDivAge)
          getElemSetAttr('medianHage_popUpData', 'innerHTML', "Median House Age: " + dataForYear.medianHage)
          getElemSetAttr('popUpYearIndicactor', 'innerHTML', " - " + currentYear)

        }

        function getAllNeighborHoodDataForYear(neighborhoodFeature) {
          let prSqFtString = 'medianPrSqFt' + '_' + currentYear;
          let subDivAgeString = 'subDivAge' +'_' + currentYear;
          let medianHageString = 'medianHage' + '_' + currentYear;
          let medianHPriceString = 'medianHPrice' + '_' + currentYear;
          let neighborHoodYearData = {
            "medianPrSqFt": neighborhoodFeature.properties[prSqFtString],
            "medianHPrice": neighborhoodFeature.properties[medianHPriceString],
            "subDivAge": neighborhoodFeature.properties[subDivAgeString],
            "medianHage": neighborhoodFeature.properties[medianHageString],

          }
          return neighborHoodYearData;
        }

        function getConsecutiveYearsforProp(feature, propertyRoot) {
          var emptyYearVals = [];
          let allProps = feature.properties
          let activeYears = yearsForData
          let dataPoints = []
          for (var i = 0; i < activeYears.length; i++) {
            let activeYr = activeYears[i]
            let propToGet = propertyRoot + "_" + activeYr;
            let propValue = feature.properties[propToGet]
            let dataPoint = {
              date: activeYears[i],
              close: propValue
            };
            dataPoints.push(dataPoint);
          }
          return dataPoints;
        }

        function chart(d, c) {
          var feature = d.feature;

          var data = getConsecutiveYearsforProp(d, 'medianPrSqFt')

          var div = d3.create("div");
          div.append("div")
            .html(c);
          var margin = {
              top: 20,
              right: 0,
              bottom: 0,
              left: 0
            },
            width = 300,
            height = 100 - margin.top - margin.bottom;
          var parseTime = d3.timeParse("%Y");

          // set the ranges
          var x = d3.scaleTime().range([0, width]);
          var y = d3.scaleLinear().range([height, 0]);

          // define the line
          var valueline = d3.line()
            .x(function(d) {
              return x(d.date);
            })
            .y(function(d) {
              return y(d.close);
            });

          var svg = div.append("svg")
            .attr("class", "popUpChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

          var area = d3.area()
            .x(function(d) {
              return x(d.date);
            })
            .y0(height)
            .y1(function(d) {
              return y(d.close);
            })

            // format the data
            data.forEach(function(d) {
              d.date = parseTime(d.date);
              if (isNaN(d.close)){
                d.close = 0;
              } else {
              d.close = +d.close;
              }
            })


            // Scale the range of the data
            x.domain(d3.extent(data, function(d) {
              return d.date;
            }));
            y.domain([0, d3.max(data, function(d) {
              return d.close;
            })]);

            // Add the valueline path.
            svg.append("path")
              .data([data])
              .attr("class", "line")
              .attr("d", valueline);

            const defs = svg.append('defs')
              .append('pattern')
              .attr('id', 'some-pattern')
              .attr('patternUnits', 'userSpaceOnUse')
              .attr('width', 10)
              .attr('height', 10)
              .append('image')
              .attr('xlink:href',
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nOScgaGVpZ2h0PScxMCcgZmlsbD0nYmxhY2snIC8+Cjwvc3ZnPg=='
              )
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 10)
              .attr('height', 10)

            const defs2 = svg.append('defs')
              .append('pattern')
              .attr('id', 'diagonal-stripe-1')
              .attr('patternUnits', 'userSpaceOnUse')
              .attr('width', 10)
              .attr('height', 10)
              .append('image')
              .attr('xlink:href',
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+Cg=='
              )
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 10)
              .attr('height', 10)

            //Fill Under Line
            svg.append("path")
              .data([data])
              .attr("class", "area")
              .attr("d", area)
              .style("fill", "url(#diagonal-stripe-1)")
              .style("fill-opacity", .4)

            function detectVoid(someData){
              let numZeros = 0;
              let zeroIndexes = [];
              for (var i = 0; i < someData.length; i++) {

                let curData = someData[i]
                if (curData.close == 0){
                  numZeros = numZeros + 1
                  zeroIndexes.push(i)
                }
              }
              let firstValToGet = someData[numZeros]
              if (firstValToGet !== undefined) {
                console.log(firstValToGet.close);
                  let dateOfFirstNonZero = firstValToGet.date
                  let dummyPoint = {
                    'close': 1,
                    'date': dateOfFirstNonZero
                  }
                  someData.splice(numZeros, 0, dummyPoint)
              }


              return someData
            }
            function yearLabelOffset(index, length){
              if (index == 0){
                return 10;
              }
              if (index == (length - 1)){
                return -30;
              } else{
                return 0;
              }
            }

            svg.append("text")
                .attr('id', 'popUpGraphTitle')
                .attr("x", (width / 2))
                .attr("y", height-5)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .style("fill", "rgb(255, 255, 255)")
                .text("Price Per Square Foot: 2000-2020");

            for (var i = 0; i < data.length; i++) {
              let widthInc = width/data.length
              svg.append("text")
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', height)
                .text(yearsForData[i])
                .attr("transform", "translate(" + (x(data[i].date)+yearLabelOffset(i, yearsForData.length))+ "," + (y(data[i].close)- 10)  + ")")
                .style('fill', 'white')

              svg.append("circle")
                .attr('id', 'graphDateCircle_'+i)
                .attr('class', 'graphDateCircle')
                .attr("transform", "translate(" + x(data[i].date) + "," + y(data[i].close) + ")")
                .attr("r", 3)
                .style("fill", "black")
                .style("stroke", "white")
            }


          return div.node();

        }

        //HISTORY SIDEBAR
        function getHistoryObject(targetSubDivName, allHistObjects){
          for (i = 0; i < allHistObjects.length; i++) {
            let  curHistObj = allHistObjects[i];
            let curSubDivName = curHistObj.Subdivision_Name;
            if (curSubDivName == targetSubDivName){
              return curHistObj;
            }
          }
        }

        function setLeftSidebarContent(historyObj){

            getElemSetAttr("leftSideBarHeading", "innerHTML", historyObj.Subdivision_Name);
            getElemSetAttr("leftSideBarHistoryText", "innerHTML", historyObj.Text);
            getElemSetAttr("ExtraFacts", "innerHTML", historyObj.Extra_Facts);
            getElemSetAttr("InfoLink1", "innerHTML", historyObj.Info_Link_1);
            getElemSetAttr("InfoLink2", "innerHTML", historyObj.Info_Link_2);


            getElemSetAttr("Image1", "src", historyObj.Image_1_Link);
            getElemSetAttr("Image2", "src", historyObj.Image_2_Link);
            getElemSetAttr("Image3", "src", historyObj.Image_3_Link);
            getElemSetAttr("Image4", "src", historyObj.Image_4_Link);


            getElemSetAttr("Image1Attribution", "innerHTML", historyObj.Image_1_Attribution)
            getElemSetAttr("Image2Attribution", "innerHTML", historyObj.Image_2_Attribution)
            getElemSetAttr("Image3Attribution", "innerHTML", historyObj.Image_3_Attribution)
            getElemSetAttr("Image4Attribution", "innerHTML", historyObj.Image_4_Attribution)

            getElemSetAttr("Image1Attribution", "href", historyObj.Resource_Link_1)
            getElemSetAttr("Image2Attribution", "href", historyObj.Resource_Link_2)
            getElemSetAttr("Image3Attribution", "href", historyObj.Resource_Link_3)
            getElemSetAttr("Image4Attribution", "href", historyObj.Resource_Link_4)


        }

        //UTILS


        function appendToInnerHTML(elem, toAppend){
          elem.innerHTML = elem.innerHTML + toAppend
          return elem;
        }

        function arr_diff (a1, a2) {

            var a = [], diff = [];

            for (var i = 0; i < a1.length; i++) {
                a[a1[i]] = true;
            }

            for (var i = 0; i < a2.length; i++) {
                if (a[a2[i]]) {
                    delete a[a2[i]];
                } else {
                    a[a2[i]] = true;
                }
            }

            for (var k in a) {
                diff.push(k);
            }

            return diff;
        }

        function createClassIdAppend(masterParent, htmlType, className, idName) {
          let elementToAdd = document.createElement(htmlType);
          elementToAdd.setAttribute('class', className);
          elementToAdd.setAttribute('id', idName);
          if (masterParent == "ignore"){
            return elementToAdd;
          }
          if (masterParent !== null){
            masterParent.appendChild(elementToAdd);
          }
          return elementToAdd;
        }

        function getElemSetAttr(elemID, attr, content){
          let elemToGet = document.getElementById(elemID);
          elemToGet[attr] = content;
        }

        function getElemSetStyle(elemID, styleAttr, content){
          let elemToGet = document.getElementById(elemID)
          elemToGet.style[styleAttr] = content
        }

        function getClassSetAttr(className, attr, content, isStyle){
         let elemCol = document.getElementsByClassName(className);
          if (isStyle == true){
             for (var i = 0; i < elemCol.length; i++) {
               let curElem = elemCol[i]
               curElem.style[attr] = content;
             }
          } else {

           for (var i = 0; i < elemCol.length; i++) {
             let curElem = elemCol[i]
             curElem[attr] = content;
           }
         }
        }

        function inArray(needle,haystack)
          {
              var count=haystack.length;
              for(var i=0;i<count;i++)
              {
                  if(haystack[i].soloIndex === needle.soloIndex){return true;}
              }
              return false;
          }

        function toggleLeftGeneric(){
            leftSidebar.toggle();
        }

        function setStyleForClass(className, attr, value){
          let classToGet = document.getElementsByClassName(className);
          for (var i = 0; i < classToGet.length; i++) {
            let curElem = classToGet[i];
            curElem.style[attr] = value;
          }
        }
