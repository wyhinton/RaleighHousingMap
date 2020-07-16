#This script analyzes CSV sheets exported from GIS software for Residential Property in Raleigh for the years 2000, 2005, 2010, 2015, and 2020.
#Using this data, it calcuates median price per square foot, subdivision age, median house age, and median house price .
#This data is formatted into a central CSV sheet for all four years than can then be joined with the Subdivisions Shapefile.


import datetime
import pandas as pd
from functools import reduce
from scipy import stats
from scipy.stats import zscore
import numpy as np
#Import External Data
subdivisionNames = 'NEW_GIS_PYTHON_DATA/SOURCE_DATA/SubDivisionNames.csv'
propPrefix = 'NEW_GIS_PYTHON_DATA/SOURCE_DATA/PROPERTY/'
validationFolder = 'NEW_GIS_PYTHON_DATA/validation'
currentTime = pd.Timestamp('2020-04-4')
years = ['2000', '2005', '2010', '2015', '2020']
CSVFileNames = [propPrefix + '1_Raleigh_Property_2000_02_Residential_Centroids_SubDiv_Name.csv',
                propPrefix + '2_Raleigh_Property_2005_12_Residential_Centroids_SubDiv_Name.csv',
                propPrefix + '3_Raleigh_Property_2009_12_Residential_Centroids_SubDiv_Name.csv',
                propPrefix + '4_Raleigh_Property_2015_12_Residential_Centroids_SubDiv_Name.csv',
                propPrefix + '5_Raleigh_Property_2020_02_Residential_Centroids_SubDiv_Name.csv',
                ]
exportPath = 'NEW_GIS_PYTHON_DATA/exports/'

propertyFrames = []
sources = []

#Generate DataFrame for Subdivisions, converting APPROVDATE to datetime
allSubDivNamesFrame = pd.read_csv(subdivisionNames, header = 0)
allSubDivNamesFrame['TIME'] = pd.to_datetime(allSubDivNamesFrame['APPROVDATE'], errors='coerce', infer_datetime_format=True)

#Generate a DataFrame for each Property CSV
for filename in CSVFileNames:
    sources.append(filename)
    yearFrame = pd.read_csv(filename)
    propertyFrames.append(yearFrame)

#Initialize Arrays For Different Varaibles
prSqFtSetFrames = []
houseAgeFrames = []
homePriceFrames = []
homePriceFrames = []
allFrames = []
mydictionary = dict(zip(sources,propertyFrames))
subDivAgeTable = pd.DataFrame()

def drop_numerical_outliers(df, col):
    df['col_zscore'] = np.abs((df[col] - df[col].mean())/df[col].std(ddof=0))
    return df.drop(df.index[df['col_zscore'] > 3])

def remove_outlier(df_in, col_name):
    q1 = df_in[col_name].quantile(0.1)
    q3 = df_in[col_name].quantile(0.9)
    iqr = q3-q1 #Interquartile range
    fence_low  = q1-1.5*iqr
    fence_high = q3+1.5*iqr
    df_out = df_in.loc[(df_in[col_name] > fence_low) & (df_in[col_name] < fence_high)]
    return df_out


#Process Data for Years
for x in range(len(mydictionary)):
    curKey = sources[x]
    checkYear = years[x]
    yearTime = datetime.datetime.strptime(checkYear, '%Y')
    curPropFrame = propertyFrames[x]

    #Calculate Home Price
    curPropFrame['PRICE'] = pd.to_numeric(curPropFrame['BLDG_VAL'] + curPropFrame['LAND_VAL'])

    #Remove Outliers for Price and Price Per Square Foot
    print(len(curPropFrame.index))
    curPropFrame = drop_numerical_outliers(curPropFrame, 'PRICE')
    curPropFrame = drop_numerical_outliers(curPropFrame, 'PR_SQ_FT')
    print(len(curPropFrame.index))

    #Calculate House Age
    curPropFrame['TIME']  =  pd.to_datetime(curPropFrame['YEAR_BUILT'], errors='coerce', format= '%Y')
    curPropFrame['AGE'] =  (yearTime-curPropFrame['TIME']).astype('timedelta64[D]')
    curPropFrame['AGE'] =  (curPropFrame['AGE']/365).round(0)

    #Calculate Subdivision Age, Add To Subdivision Age Table
    subDivAgeFrame = pd.DataFrame(columns=['SubDivName', 'SubDivAge'])

    subDivAgeFrame['SubDivAge'] = (yearTime - allSubDivNamesFrame['TIME']).astype('timedelta64[D]')
    subDivAgeFrame['SubDivAge'] = (subDivAgeFrame['SubDivAge'] / 365).round(0)
    subDivAgeFrame.apply(pd.to_numeric)
    subDivAgeFrame = subDivAgeFrame.mask(subDivAgeFrame < 0.0, 'void')
    subDivAgeFrame['SubDivName'] = allSubDivNamesFrame['NAME']
    subDivAgeFrame = subDivAgeFrame.rename(columns={'SubDivAge': 'SubDivAge_' + years[x]})

    subDivAgeTable['SubDivName'] = subDivAgeFrame['SubDivName']
    subDivAgeTable['subDivAge_' + years[x]] = subDivAgeFrame['SubDivAge_' + years[x]]

    #Calculate Medians for Home Price , Price Per Square Foot, House Age
    homePriceFrame = curPropFrame.groupby('SubDivName', as_index=False)['PRICE'].agg(['median'])
    prSqFtFrame = curPropFrame.groupby('SubDivName', as_index=False)['PR_SQ_FT'].agg(['median'])
    houseAgeFrame = curPropFrame.groupby('SubDivName', as_index=False)['AGE'].agg(['median'])

    #Add Suffixes To Identify Variablesariable
    houseAgeFrame = houseAgeFrame.add_suffix('Hage_'+years[x])
    homePriceFrame = homePriceFrame.add_suffix('HPrice_'+years[x])
    prSqFtFrame = prSqFtFrame.add_suffix('PrSqFt_' + years[x])
  
    #Append Frames to Subsets
    prSqFtSetFrames.append(prSqFtFrame)
    houseAgeFrames.append(houseAgeFrame)
    homePriceFrames.append(homePriceFrame)

    #Append Frames To Master Set
    allFrames.append(prSqFtFrame)
    allFrames.append(houseAgeFrame)
    allFrames.append(homePriceFrame)


#Add Subdivion Age Chart to All Frames, Merge All Frames, and Export
subDivAgeTable.to_csv(exportPath + 'test.csv')
allFrames.append(subDivAgeTable)
masterData = reduce(lambda  left,right: pd.merge(left,right,on=['SubDivName'],how='outer'), allFrames).fillna('void')
masterData.to_csv(exportPath + 'propertyMasterData.csv')

